import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());

app.get('/api/student', (req, res) => {
let student = [
    { id: 1, name: "Harsh", age: 21 },
    { id: 2, name: "Akshay", age: 18 },
    { id: 3, name: "Rohit", age: 20 },
    { id: 4, name: "Riddhima", age: 19 },
    { id: 5, name: "Adharsh", age:18},
    { id: 6, name: "Gagan", age: 20 },
    { id: 7, name: "Punit", age: 22 },
]
    res.send(student);
});

app.listen(port, () => {
    console.log(`server running at port http://localhost:${port}`);
})