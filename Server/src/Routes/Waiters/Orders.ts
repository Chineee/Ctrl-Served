import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Order from "../../models/Orders"
import Joi from "joi";
import Menu from "../../models/Menus";
import FoodQueue from "../../models/FoodQueue";
import DrinkQueue from "../../models/DrinkQueue";

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
    app.get('/', isLogged, hasRole("Waiter"), async (req, res) => {
        try {
            const orders = await Order.find(req.query);
            return res.status(200).send(orders);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    //GET endpoint to retrieve all orders based on the query parameters passed
    app.get('/:id', isLogged, hasRole("Waiter"), async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            return res.status(200).send(order);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    //PUT endpoint to create a new order
    app.put('/', isLogged, hasRole('Waiter'), async (req, res) => {
        // Validate the input data using the defined schema
        const {error} = OrderSchemaValidation.validate(req.body);
        if (error) return res.status(400).send("Invalid input");

        let dishDict = req.body.dishDict;
        const allOrders = [];
        const queue = [];

        //TODO usa una variabile globale per evitare due ordini con lo stesso numero
        // Generate a unique order number
        const orderNumber = (await Order.find().sort({orderNumber: -1}).limit(1))[0]?.orderNumber + 1 || 1;

        // Iterate through the dish dictionary and create order and queue objects
        for (const key in dishDict) {
            const dish = await Menu.findById(key);
            for (let i = 0; i < dishDict[key]; i++) {
                const order = new Order({
                    tableNumber: req.body.tableNumber,
                    waiterId: req.user._id,
                    dish: key,
                    price: dish.dishPrice,
                    ready: false,
                    type: req.body.type,
                    orderNumber: orderNumber
                });

                const added = new FoodQueue({
                    order: order._id,
                    dish: key,
                    productionTime: dish.dishProductionTime,
                    begin: false,
                    end: false,
                    orderNumber: orderNumber
                })
                allOrders.push(order);
                queue.push(added)
            }
        }

        // Save the new orders and queue objects to the database
        try {
            // Insert all the orders and queue objects into the respective collections
            await Order.insertMany(allOrders);
            if (req.body.type === 'Foods') await FoodQueue.insertMany(queue);
            else await DrinkQueue.insertMany(queue);

            return res.status(200).send("Order sent successfully")
            //TODO notify cook
        } catch(err) {
            return res.status(400).send(err);
        }
    });

    //POST endpoint to update an existing order
    app.post("/:id", isLogged, hasRole('Waiter'), async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order === null) return res.status(400).send("Order doesn't exist");

        if(req.body.new_tableNumber !== null) order.tableNumber = req.body.new_tableNumber;

        let dishInQueue;

        if(order.type === 'Foods')  dishInQueue = await FoodQueue.findOne({order: req.params.id});
        else dishInQueue = await DrinkQueue.find({order: req.params.id});

        if(req.body.new_dish !== null){
            if(dishInQueue.begin) return res.status(400).send("This order is already in the making you cannot modify it");
        }

        const id1 : string = req.user._id.toString();
        const id2 : string = order.waiterId.toString();


        if(req.body.new_dish !== null && id1 === id2){
            const price = (await Menu.findById(req.body.new_dish)).dishPrice
            order.dish = req.body.new_dish;
            order.price = price;
        }

        // Save the changes to the order in the database
        try{
            await order.save();
            return res.status(200).send("Order updated correctly");
        }catch (err) {
            return res.status(400).send(err);
        }
    });

    return app;
}

// app.get('/addFood', async (req, res) => {
//     const dish = new Menu();
//
//     const menu = [
//         {
//             dishPrice: 8,
//             dishName:"Spaghetti",
//             dishProductionTime: 22,
//             dishType: "Food"
//         },
//         {
//             dishPrice: 45,
//             dishName: "Pizza",
//             dishProductionTime: 15,
//             dishType: "Food"
//         },
//         {
//           dishPrice: 5,
//           dishName: "Manzo funghi e bamboo",
//           dishProductionTime: 17,
//           dishType: "Food"
//         },
//         {
//           dishPrice: 100,
//           dishName: "Aragosta con sashimi",
//           dishProductionTime: 20,
//           dishType: "Food"
//         },
//         {
//             dishPrice: 13,
//             dishName:"Cosmopolitan",
//             dishProductionTime: 4,
//             dishType:"Drink"
//         },
//         {
//             dishPrice: 22,
//             dishName:"Sex on the beach",
//             dishProductionTime: 1,
//             dishType:"Drink"
//         },
//         {
//             dishPrice: 10,
//             dishName:"Gin tonic",
//             dishProductionTime: 3,
//             dishType:"Drink"
//         },
//         {
//             dishPrice: 14,
//             dishName:"Cuba Libre",
//             dishProductionTime: 6,
//             dishType:"Drink"
//         },
//         {
//             dishPrice: 2,
//             dishName: "Coca cola",
//             dishProductionTime: 1,
//             dishType:"Drink"
//         },
//         {
//             dishPrice: 4,
//             dishName:"Fuze the rosa e pesca",
//             dishProductionTime: 1,
//             dishType:"Drink"
//         },
//         {
//             dishPrice: 4,
//             dishName:"Fuze the limone e lime",
//             dishProductionTime: 1,
//             dishType:"Drink"
//         },
//     ]
//
//     for (let i = 0; i < menu.length; i++) {
//         const add = new Menu(menu[i]);
//         await add.save();
//     }
//
//     return res.send("k")
// })

//QUESTO ANDAVA NELLA PUT DI ORDINE


// const order = new Order({
//     tableNumber: req.body.tableNumber,
//     waiterId: req.user._id,
//     dishDict: req.body.foodDict,
//     price: price,
//     readyCount: 0,
//     type: req.body.type
// });
//
// try {
//     await order.save();
// } catch(err) {
//     return res.status(400).send(err);
// }
//
// // Metti i cibi nella food queue
// const queue = []
// for(let key in dishDict) {
//     let addQueue;
//     if (order.type === 'Foods') {
//         addQueue = new FoodQueue();
//         addQueue.position = (await FoodQueue.find()).length + 1;
//     }
//     else {
//         addQueue = new DrinkQueue();
//         addQueue.position = (await DrinkQueue.find()).length + 1;
//     }
//
//     addQueue.order = order._id;
//     addQueue.dish = key;
//     addQueue.productionTime = (await Menu.findById(key)).dishProductionTime;
//     addQueue.begin = false;
//     addQueue.end = false;
//
//     try {
//         await addQueue.save();
//     } catch (err) {
//         return res.status(400).send("error");
//     }
// }