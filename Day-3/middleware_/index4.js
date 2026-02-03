import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "public","index.html");
});
app.post('/submit', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }
    console.log({email});
    res.send(` <h1>Form Submitted</h1>
     <p><strong>Email:</strong> ${email}</p>
     <p><strong>Password:</strong> ${password}</p>`);
});
app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
});