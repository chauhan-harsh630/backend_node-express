import express from "express";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("<h1>Home page</h1>");
});

app.post('/admin', (req, res) => {
    res.sendStatus(201); 
});

app.put('/login', (req, res) => {
    res.sendStatus(204);
});
app.patch('/login', (req, res) => {
    res.sendStatus(200);
});

app.delete('/admin/login', (req, res) => {
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
});