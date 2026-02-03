import express from 'express';

const app = express();
const port = 3000;

function logger(req,res,next) {
    console.log("Request methods " + req.method);
    console.log("Request url: " + req.url);
    next();
}
app.use(logger);
app.get('/', (req, res) => {
    res.send("Hello world");
})
app.listen(port, () => {
    console.log(`Listen at post ${port}`);
});