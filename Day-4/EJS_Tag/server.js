import express from 'express';


const app = express();
  
app.set("view engine", "ejs");
const port = 4000;
app.get('/', (req, res) => {
    const data = {
        title: "EJS Tag",
        second: new Date().getSeconds(),
        item: ["Apple", "Banana", "Orange", "Papay"],
        htmlContent:"<strong> This is another strong tag</strong>"
    };
    res.render("index", data);
});

app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
});
