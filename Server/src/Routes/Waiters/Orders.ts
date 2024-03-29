import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Order from "../../models/Orders"
import Joi from "joi";
import Menu from "../../models/Menus";
import {FoodQueue, DrinkQueue} from "../../models/Queue";
import client from "../../redis-config"
import getIoInstance from "../../socketio-config";
import User from "../../models/User";

//Define a schema for order input validation using Joi
export const OrderSchemaValidation = Joi.object().keys({
    tableNumber: Joi.number().required(),
    dishDict: Joi.object().pattern(Joi.string(), Joi.number()).required(),
    type: Joi.string().required()
})

//Export the router
export default (): Router => {
    const app = Router();

    //GET endpoint to retrieve all orders based on the query parameters passed
    app.get('/', isLogged, hasRole("Waiter", "Cashier"), async (req, res) => {
        try {
            //example get by tablenumber
            //todo add {orderNumber: {$gt: -1}} to avoid order done, maybe add a filter ?deleted=true to remove this GT
            const orders = await Order.find(req.query).populate("dish");
            return res.status(200).send(orders);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    //GET endpoint to retrieve one order based on the parameters passed
    app.get('/:id', isLogged, hasRole("Waiter", "Cashier"), async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            return res.status(200).send(order);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // POST endpoint to create a new order
    app.post('/', isLogged, hasRole('Waiter'), async (req, res) => {
        // Validate the input data using the defined schema
        const {error} = OrderSchemaValidation.validate(req.body);
        if (error) return res.status(400).send({status:400, error:true, errorMessage: "Invalid input"});

        let dishDict = req.body.dishDict;
        const allOrders = [];
        const queue = [];

        const orderNumber = req.query?.orderNumber ? req.query.orderNumber : await client.incr("orderNumber");
        // Iterate through the dish dictionary and create order and queue objects
        for (const key in dishDict) {
            const dish = await Menu.findById(key);
            try {
                for (let i = 0; i < dishDict[key]; i++) {
                    const order = new Order({
                        tableNumber: req.body.tableNumber,
                        waiterId: req.user._id,
                        dish: key,
                        price: dish.price,
                        type: req.body.type,
                        orderNumber: orderNumber,
                        ready: false
                    });

                    //todo fix this error, should it be new foodqueue for food and new drinkqueue for drinks?
                    const added = {
                        order: order._id,
                        dish: key,
                        productionTime: dish.productionTime,
                        begin: false,
                        end: false,
                        orderNumber: orderNumber,
                        makerId: null,
                    }
                    if (req.body.type === "Foods") queue.push(new FoodQueue(added));
                    else queue.push(new DrinkQueue(added));
                    allOrders.push(order);
                }
            } catch(err) {
                return res.status(400).send(err);
            }
        }

        // Save the new orders and queue objects to the database
        try {
            // Insert all the orders and queue objects into the respective collections
            await Order.insertMany(allOrders);
            if (req.body.type === 'Foods') await FoodQueue.insertMany(queue);
            else await DrinkQueue.insertMany(queue);


            getIoInstance().emit("Order_sent");
            
            return res.status(200).send({status:200, error: false, message: "The order was sent successfully"})
            //TODO notify cook
        } catch(err) {
            return res.status(400).send(err);
        }
    });

    // PUT endpoint to update an existing order
    app.put("/:id", isLogged, hasRole('Waiter'), async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order === null) return res.status(400).send({status: 400, error: true, errorMessage: "The order doesn't exist"});

        if(req.body.new_tableNumber !== null) order.tableNumber = req.body.new_tableNumber;

        let dishInQueue;

        if(order.type === 'Foods')  dishInQueue = await FoodQueue.findOne({order: req.params.id});
        else dishInQueue = await DrinkQueue.find({order: req.params.id});

        if(req.body.new_dish !== null){
            if(dishInQueue.begin) return res.status(400).send({status:400, error: true, errorMessage: "This order is already in the making, you cannot modify it"});
        }

        const id1 : string = req.user._id.toString();
        const id2 : string = order.waiterId.toString();


        if(req.body.new_dish !== null && id1 === id2){
            const price = (await Menu.findById(req.body.new_dish)).price
            order.dish = req.body.new_dish;
            order.price = price;
        }

        // Save the changes to the order in the database
        try{
            await order.save();
            getIoInstance().emit("order_modified")
            return res.status(200).send({error: false, status:200, message:"The order was updated correctly"});
        }catch (err) {
            return res.status(400).send(err);
        }
    });

    // PUT endpoint to set orderNumber to -1 to say that order has been delivered to the table
    app.put('/', isLogged, hasRole('Waiter'), async (req, res) => {
        try {
            const orders = await Order.find({orderNumber: req.query.orderNumber});
            if (orders.length > 0 && orders[0].waiterId.toString() !== req.user._id.toString()) return res.status(403).send({error: true, status:403, errorMessage:"Insufficient permission"})
            const orderModified = await Order.updateMany({orderNumber: req.query.orderNumber}, {orderNumber: -1});
            await User.findOneAndUpdate({_id: req.user._id}, {$inc: {"counter.dishesServed": orderModified.modifiedCount}})
            getIoInstance().emit('Order_sent')
            return res.status(200).send({error: false, status: 200, message: "The orrder was modified correctly"})
        } catch(err) {
            console.log(err);
            return res.status(400).send({error:true, status:400, errorMessage:err})
        }
    })

    // DELETE endpoint to delete an order based on the order ID
    app.delete('/:id', isLogged, hasRole('Waiter', 'Cashier'), async (req, res) => {
        const order = await Order.findById(req.params.id);
        if(order === null) return res.status(400).send({status: 400, error: true, errorMessage: "The order doesn't exist"});

        try{
            await order.deleteOne();
            if (order.type === 'Foods') await FoodQueue.deleteOne({order: order._id});
            else await DrinkQueue.deleteOne({order: order._id});
            getIoInstance().emit('Order_sent')
            return res.status(200).send({status:200, error: false, message: "The order was successfully deleted"})
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete all orders with a specific order number
    app.delete('/', isLogged, hasRole("Admin"), async (req, res) => {
        //WARNING USE IT WITH REQ.QUERY TO DELETE ORDER NUMBER SPECIFICO
        try {
            if (Object.keys(req.query).length !== 0 && req.query.orderNumber !== undefined) {
                await Order.deleteMany(req.query);
                await FoodQueue.deleteMany(req.query)
            } else return res.status(403).send({status:403, error: true, errorMessage:"Insufficient permission"})

            return res.status(200).send({status:200, error: false, message: "The orders were successfully deleted"})
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    return app;
}
