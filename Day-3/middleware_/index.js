import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));



const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
   
    res.sendFile(__dirname + "/public/index.html");

});

app.post('/submit', (req, res) => {
    res.send("Form submitted successfully");
    console.log(req.body);
});
app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
});