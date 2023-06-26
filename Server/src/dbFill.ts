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
                "counter":4
            }),
            new User({
                "name": "cuoco",
                "surname": "cuoco",
                "email": "cuoco@gmail.com",
                "password": await getPassword("cuoco"),
                "role": "Cook",
                "counter":10
            }),
            new User({
                "name": "barista",
                "surname": "barista",
                "email": "barista@gmail.com",
                "password": await getPassword("barista"),
                "role": "Bartender",
                "counter":7
            }),
            new User({
                "name": "cameriere",
                "surname": "cameriere",
                "email": "cameriere@gmail.com",
                "password": await getPassword("cameriere"),
                "role": "Waiter",
                "counter": {tablesServed: 8, customersServed: 20, dishesServed: 32}
            }),
            new User({
                "name":"cameriere2",
                "surname":"cameriere2",
                "email":"cameriere2@gmail.com",
                "password":await getPassword("cameriere2"),
                "role":"Waiter",
                "counter": {tablesServed: 5, customersServed: 9, dishesServed: 10}
            }),
            new User({
                "name": "Marco",
                "surname": "Chinellato",
                "email": "marco@gmail.com",
                "password": await getPassword("marco"),
                "role": "Cook",
                "counter": 8
            }),
            new User({
                "name": "Martino",
                "surname": "Pistellato",
                "email": "martino@gmail.com",
                "password": await getPassword("martino"),
                "role":"Waiter",
                "counter":{tablesServed: 8, customersServed: 13, dishesServed: 18}
            }),
            new User({
                "name": "Giulia",
                "surname": "Renier",
                "email": "giulia@gmail.com",
                "password": await getPassword("giulia"),
                "role": "Waiter",
                "counter": {tablesServed: 12, customersServed: 20, dishesServed: 32}
            }),
            new User({
                "name": "Cristina",
                "surname": "Codato",
                "email": "cristina@gmail.com",
                "password": await getPassword("cristina"),
                "role":"Waiter",
                "counter":{tablesServed: 1, customersServed: 4, dishesServed: 7}
            }),
            new User({
                "name": "Damien",
                "surname": "Boursinach",
                "email": "damien@gmail.com",
                "password": await getPassword("damien"),
                "role": "Waiter",
                "counter": {tablesServed: 2, customersServed: 6, dishesServed: 10}
            }),
            new User({
                "name":"Elisa",
                "surname":"Rizzo",
                "email":"elisa@gmail.com",
                "password":await getPassword("elisa"),
                "role":"Bartender",
                "counter": 18
            }),
            new User({
                "name":"Stefano",
                "surname":"Calzavara",
                "email":"stefano@gmail.com",
                "password":await getPassword("stefano"),
                "role":"Bartender",
                "counter": 14
            }),
            new User({
                "name":"Heat",
                "surname":"Ledger",
                "email":"heat@gmail.com",
                "password":await getPassword("heat"),
                "role":"Bartender",
                "counter": 16
            }),
            new User({
                "name":"Johnny",
                "surname":"Depp",
                "email":"johnny@gmail.com",
                "password":await getPassword("johnny"),
                "role":"Bartender",
                "counter": 23
            }),
            new User({
                "name":"Ryan",
                "surname":"Reynolds",
                "email":"ryan@gmail.com",
                "password":await getPassword("ryan"),
                "role":"Bartender",
                "counter": 15
            }),
            new User({
                "name":"Gordon",
                "surname":"Ramsey",
                "email":"gordon@gmail.com",
                "password":await getPassword("gordon"),
                "role":"Cook",
                "counter": 26
            }),
            new User({
                "name":"Antonino",
                "surname":"Cannavacciuolo",
                "email":"antonino@gmail.com",
                "password":await getPassword("antonino"),
                "role":"Cook",
                "counter": 30
            }),
            new User({
                "name":"Joe",
                "surname":"Bastianich",
                "email":"joe@gmail.com",
                "password":await getPassword("joe"),
                "role":"Cook",
                "counter": 12
            }),
            new User({
                "name":"Luca",
                "surname":"Furegon",
                "email":"luca@gmail.com",
                "password":await getPassword("luca"),
                "role":"Cashier",
                "counter": 12
            }),
            new User({
                "name":"Riccardo",
                "surname":"Focardi",
                "email":"riccardo@gmail.com",
                "password":await getPassword("riccardo"),
                "role":"Cashier",
                "counter": 20
            }),
            new User({
                "name":"Alessandra",
                "surname":"Raffaetà",
                "email":"alessandra@gmail.com",
                "password":await getPassword("alessandra"),
                "role":"Cashier",
                "counter": 17
            }),
            new User({
                "name":"Andrea",
                "surname":"Marin",
                "email":"andrea@gmail.com",
                "password":await getPassword("andrea"),
                "role":"Cashier",
                "counter": 28
            }),
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
        const ids = {7: users[7]._id.toString(), 8: users[8]._id.toString(), 9:users[9]._id.toString(), 10:users[10]._id.toString()}
        // 8 (5)

        await Receipt.insertMany([
            createReceipt(dishes, "30/06/2023", "12:22:30", ids[7]),
            createReceipt(dishes, "30/06/2023", '13:45:56', ids[7]),
            createReceipt(dishes, "28/06/2023", "19:48:20", ids[7]),
            createReceipt(dishes, "26/06/2023", '20:23:38', ids[8]),
            createReceipt(dishes, '15/06/2023', '22:10:00', ids[8]),
            createReceipt(dishes, '04/06/2023', '13:45:56', ids[9]),
            createReceipt(dishes, '12/05/2023', '13:45:56', ids[7]),
            createReceipt(dishes, '14/05/2023', '13:33:32', ids[8]),
            createReceipt(dishes, '24/11/2021', '12:05:33', ids[8]),
            createReceipt(dishes, '09/02/2023', '21:45:50', ids[7]),
            createReceipt(dishes, '05/02/2023', '20:31:03', ids[7]),
            createReceipt(dishes, '25/12/2022', '13:29:10', ids[7]),
            createReceipt(dishes, '05/12/2020', '23:23:23', ids[10]),
            createReceipt(dishes, '26/09/2021', '19:47:03', ids[9]),
            createReceipt(dishes, '25/09/2021', '13:26:17', ids[8]),
            createReceipt(dishes, '06/10/2021', '14:12:00', ids[8]),
            createReceipt(dishes, '14/11/2020', '20:14:11', ids[7]),
            createReceipt(dishes, '27/07/2022', '14:39:07', ids[8]),
            createReceipt(dishes, '14/02/2019', '23:56:23', ids[8]),
            createReceipt(dishes, '20/06/2019', '14:39:07', ids[8]),
            createReceipt(dishes, '06/07/2019', '21:03:57', ids[8]),
            createReceipt(dishes, '24/06/2019', '22:38:10', ids[8]),
            createReceipt(dishes, '11/09/2019', '19:22:44', ids[8])
        ])
    }
}

function createReceipt(dishes: any[], date: string, hour: string, waiterId: string) {
    const R_VALUE = Math.floor(Math.random()*6 + 1);
    const dishesSelected = [];
    let price = 0;
    for (let i = 0; i < R_VALUE; i++) {
        const dish = dishes[Math.floor(Math.random()*15)];
        dishesSelected.push(dish._id.toString());
        price += dish.price;
    }

    return new Receipt({
        tableNumber: Math.floor(Math.random()*5+1),
        dishes: dishesSelected,
        date: date,
        hour: hour,
        price: price.toFixed(2),
        waiterId: waiterId
    })
}

insertAll().then(() => {
    console.log("All items added");
    process.exit();
})
