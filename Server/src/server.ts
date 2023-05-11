import express from 'express';
import * as dotenv from 'dotenv';
import * as test from "./models/test";

const app = express()
const PORT = 5000

app.get('/api/sium', (req, res) => {
    res.send("porca")
})

app.get('/api', (req, res) => {
    res.send("QOIBWESDOQIWEPDFQPOWEDNBII")
})

app.listen(PORT, () => {
    console.log("Server listening in http://localhost:"+PORT);
})