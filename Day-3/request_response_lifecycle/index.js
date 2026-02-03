import express from "express"


const app = express();
const port = 3000;
app.use(express.json());

const post = [
    { id: 1, name: "Post one" },
    { id: 2, name: "Post two" },
    { id: 3, name: "Post three" }
]

app.get('/', (req, res) => {
    console.log(req.query);
    res.json(post);
});


app.get('/api/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.json(post.filter((posts) => posts.id === id));
});

app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
});