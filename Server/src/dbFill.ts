import User from "./models/User";
import Menu from "./models/Menus";
import Tables from "./models/Tables";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Receipt from "./models/Receipts";

//
async function getPassword(password) {
    const salt = await bcrypt.genSalt(10); // Generate a salt for the password hashing
    return await bcrypt.hash(password, salt)
}

async function insertAll() {
    await mongoose.connect("mongodb://host.docker.internal:27018/tawproject");
    let users, dishes;
    if (await User.countDocuments({}) === 0) {
        users = await User.insertMany([
            new User({
                "name": "admin",
                "surname": "admin",
                "email": "admin@gmail.com",
                "password": await getPassword("admin"),
                "role": "Admin",
                "counter":0
            }),
            new User({
                "name": "cassiere",
                "surname": "cassiere",
                "email": "cassiere@gmail.com",
                "password": await getPassword("cassiere"),
                "role": "Cashier",
                "counter":0
            }),
            new User({
                "name": "cuoco",
                "surname": "cuoco",
                "email": "cuoco@gmail.com",
                "password": await getPassword("cuoco"),
                "role": "Cook",
                "counter":0
            }),
            new User({
                "name": "barista",
                "surname": "barista",
                "email": "barista@gmail.com",
                "password": await getPassword("barista"),
                "role": "Bartender",
                "counter":0
            }),
            new User({
                "name": "cameriere",
                "surname": "cameriere",
                "email": "cameriere@gmail.com",
                "password": await getPassword("cameriere"),
                "role": "Waiter",
                "counter": {tablesServed: 0, customersServed: 0, dishesServed: 0}
            }),
            new User({
                "name":"cameriere2",
                "surname":"cameriere2",
                "email":"cameriere2@gmail.com",
                "password":await getPassword("cameriere2"),
                "role":"Waiter",
                "counter": {tablesServed: 0, customersServed: 0, dishesServed: 0}
            })

        ]);
    }

    if (await Menu.countDocuments({}) === 0) {

        dishes = await Menu.insertMany([
            new Menu({
                "name": "Bruschetta",
                "price": 9.99,
                "productionTime": 15,
                "type": 'Food'
            }),
            new Menu({
                "name": "Calamari",
                "price": 12.99,
                "productionTime": 20,
                "type": 'Food'
            }),
            new Menu({
                "name": "Caprese Salad",
                "price": 8.99,
                "productionTime": 10,
                "type": 'Food'
            }),
            new Menu({
                "name": "Grilled Salmon",
                "price": 18.99,
                "productionTime": 25,
                "type": 'Food'
            }),
            new Menu({
                "name": "Pasta Carbonara",
                "price": 18.99,
                "productionTime": 25,
                "type": 'Food'
            }),
            new Menu({
                "name": "Chicken Permesan",
                "price": 14.99,
                "productionTime": 20,
                "type": 'Food'
            }),
            new Menu({
                "name": "Tiramisu",
                "price": 8.99,
                "productionTime": 15,
                "type": 'Food'
            }),
            new Menu({
                "name": "Cheesecake",
                "price": 7.99,
                "productionTime": 12,
                "type": 'Food'
            }),
            new Menu({
                "name": "Chocolate Mousse",
                "price": 6.99,
                "productionTime": 10,
                "type": 'Food'
            }),
            new Menu({
                "name": "Lemonade",
                "price": 3.99,
                "productionTime": 5,
                "type": 'Drink'
            }),
            new Menu({
                "name": "Coca Cola",
                "price": 4.99,
                "productionTime": 5,
                "type": 'Drink'
            }),
            new Menu({
                "name": "Iced Tea",
                "price": 3.49,
                "productionTime": 5,
                "type": 'Drink'
            }),
            new Menu({
                "name": "Water",
                "price": 2.99,
                "productionTime": 5,
                "type": 'Drink'
            }),
            new Menu({
                "name": "Sparkling Water",
                "price": 2.99,
                "productionTime": 5,
                "type": 'Drink'
            }),
            new Menu({
                "name": "Beer",
                "price": 4.99,
                "productionTime": 2,
                "type": 'Drink'
            }),
            new Menu({
                "name": "White Wine",
                "price": 6.99,
                "productionTime": 2,
                "type": 'Drink'
            }),
            new Menu({
                "name": "Red Wine",
                "price": 7.99,
                "productionTime": 2,
                "type": 'Drink'
            })
        ]);
    }

    if (await Tables.countDocuments({}) === 0) {

        await Tables.insertMany([
            new Tables({
                "tableNumber": 1,
                "seats": 8,
                "customers": 0,
                "occupied": false,
                "waiterId": null
            }),
            new Tables({
                "tableNumber": 2,
                "seats": 2,
                "customers": 0,
                "occupied": false,
                "waiterId": null
            }),
            new Tables({
                "tableNumber": 3,
                "seats": 5,
                "customers": 0,
                "occupied": false,
                "waiterId": null
            }),
            new Tables({
                "tableNumber": 4,
                "seats": 6,
                "customers": 0,
                "occupied": false,
                "waiterId": null
            }),
            new Tables({
                "tableNumber": 5,
                "seats": 3,
                "customers": 0,
                "occupied": false,
                "waiterId": null
            }),
            new Tables({
                "tableNumber": 6,
                "seats": 1,
                "customers": 0,
                "occupied": false,
                "waiterId": null
            })
        ])
    }

    if (await Receipt.countDocuments({}) === 0) {
        const id1 = users[4]._id.toString();
        const id2 = users[5]._id.toString();

        await Receipt.insertMany([
            new Receipt({
                tableNumber: 1,
                dishes: [dishes[0]._id.toString(), dishes[1]._id.toString(), dishes[2].toString()],
                date: "01/01/2020",
                hour: "15:33",
                price: 88,
                waiterId: id1
            }),
            new Receipt({
                tableNumber: 2,
                dishes: [dishes[1]._id.toString(),dishes[3]._id.toString(),dishes[6]._id.toString(),dishes[7]._id.toString(),dishes[12]._id.toString(),dishes[16]._id.toString()],
                date: "14/02/2020",
                hour: "20:57",
                price: 149,
                waiterId: id2
            })
        ])
    }
}

insertAll().then(() => {
    console.log("All items added");
    process.exit();
})
