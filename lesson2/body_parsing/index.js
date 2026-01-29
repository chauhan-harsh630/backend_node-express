import express from "express";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let users = [
    { id: 1, name: "Harsh", email: "harsh@email.com" },
     { id: 2, name: "Akshay", email: "akshay@email.com" },
      { id: 3, name: "Riddhima", email: "riddhi@email.com" },
       { id: 4, name: "Smarth", email: "smarth@email.com" },
]

app.get('/', (req, res) => {
    res.status(200).json(users);
});
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({ meassage: "User not found" });
    }
    res.status(200).json(user);
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({
            "Content-Type":"application/json",
            meassage: "Name and Email required"
        });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
     const id = Number(req.params.id);
    const { name, email } = req.body;
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ meassage: "User nor found" });
    }

    user.name = name;
    user.email = email;

    res.status(200).json(user);
});

app.patch('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
        return res.status(404).json({ meassage: "User not found" });
    }
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    res.status(200).json(users);
});

app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ meassage: "User not found" });
    }

    users.splice(index, 1);
    res.status(204);
});

app.listen(port, () => {
    console.log(`server running at port http://localhost:${port}`);

});