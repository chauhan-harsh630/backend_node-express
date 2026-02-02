import users from '../data/users.js';
  

export const getAlluser = (req, res) => {
    res.json(users);
};

export const getUserid = (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};

export const createUser = (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ message: "Name is required" });
    }

    const newUser = {
        id: users.length + 1,
        name,
    };

    users.push(newUser);
    res.status(201).josn(newUser);
}