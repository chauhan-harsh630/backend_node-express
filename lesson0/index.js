import express from "express";
import dotenv from "dotenv";
const app = express();
const port = 4000;

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/Home', (req, res) => {
    res.send("<h1>Welcome to Backend Learning Lesson 0</h1>")
})
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}`);
});