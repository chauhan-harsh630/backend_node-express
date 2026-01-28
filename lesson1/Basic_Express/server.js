import express from "express";
const app = express();
const port = 3000;

app.get('/health', (req, res) => {   //GET: Read data (NO change)
    res.status(200).json({
        status: "ok",
        meassage: "Backend is running"
    });
});

app.get('/', (req, res) => {         //GET: Read data (NO change)
    res.send("Welcome to backend ");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})