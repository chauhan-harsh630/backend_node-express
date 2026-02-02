import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname ,'public','index.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname ,'public','about.html'));
})
 
app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
});