import express from 'express';


const app = express();
const port = 8080;

app.set("view engine", "ejs");


app.get('/', (req, res) => {
    res.render("index", {
        name: "Harsh",
    });
});

app.listen(port, () => {
    console.log(`Server is running at port http://localhost:${port}`);
});