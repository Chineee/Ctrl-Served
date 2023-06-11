import User from "./models/User";
import Menu from "./models/Menus";
import Tables from "./models/Tables";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

//
async function getPassword(password) {
    const salt = await bcrypt.genSalt(10); // Generate a salt for the password hashing
    return await bcrypt.hash(password, salt)
}

async function insertAll() {
    await mongoose.connect("mongodb://host.docker.internal:27018/tawproject");
    if (await User.countDocuments({}) === 0) {
        await User.insertMany([
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
                "counter":0
            }),
            new User({
                "name":"cameriere2",
                "surname":"cameriere2",
                "email":"cameriere2@gmail.com",
                "password":await getPassword("cameriere2"),
                "role":"Waiter",
                "counter":0
            })

        ]);
    }

    if (await Menu.countDocuments({}) === 0) {

        await Menu.insertMany([
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
}

insertAll().then(() => {
    console.log("All items added");
    process.exit();
})
