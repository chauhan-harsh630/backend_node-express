import express from "express";
import dotenv from "dotenv";


const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// fake database
let users = [
  { id: 1, name: "Harsh", email: "harsh@gmail.com", age: 21 }
];

// 🟢 GET
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({user});
});

// 🔵 POST
app.post("/users", (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    age
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// 🟡 PUT
app.put("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = {
    id: users[index].id,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age
  };

  res.status(200).json(users[index]);
});

// 🟠 PATCH
app.patch("/users/:id", (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.age) user.age = req.body.age;

  res.status(200).json(user);
});

// 🔴 DELETE
app.delete("/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(index, 1);
  res.status(200).json({ message: "User deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
