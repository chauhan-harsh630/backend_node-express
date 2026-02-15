import express from "express";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
const app = express();

app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 4000;

const posts = [
    {
        id: 1,
        author: "John Doe",
        title: "Post 1",
        content: "Content 1"
    },
    {
        id: 2,
        author: "Emmaly Watson",
        title: "Post 2",
        content: "Content 2"
    },
    {
        id: 3, 
        author: "Bob Smith",
        title: "Post 3",
        content: "Content 3"
    }
]


function authentication(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log("Verify error:", err);
    console.log("Decoded user:", user)
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    });
}

app.get('/', (req, res) => {
    res.send("Welcom to JWT Authentication");
});

app.get('/posts', authentication, (req, res) => {
    console.log("Decoded User:", req.user);
    res.json(posts.filter(post => post.author === req.user.name));;
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const accessTokan = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json({ accessTokan });
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});