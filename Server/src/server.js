
import express from 'express';
import * as dotenv from 'dotenv';

const app = express()
const PORT = 5000

app.get('/api/sium', (req, res) => {
    res.send("CAZOZOZOZOZOZOZO")
})

app.get('/api', (req, res) => {
    res.send("QOIBWESDOQIWEPDFQPOWEDNBII")
})

app.listen(PORT, () => {
    console.log("Server listening in http://localhost:"+PORT);
})