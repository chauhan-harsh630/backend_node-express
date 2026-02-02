import { createServer } from 'http';
const port = process.env.PORT || 4000;

const users = [
    { id: 1, name: "Harsh" },
    { id: 2, name: "Akshay" },
    { id: 3, name: 'Ravi' },
    { id: 4, name: "Riddhima" },
    { id: 5, name: "Tushar" },
];
function logger(req, res, next){
    console.log(`${req.method} ${req.url}`);
    next();
}

const server = createServer((req, res) => {
    logger(req, res, () => {
        if (req.url === '/api/users' && req.method === "GET") {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(users));
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'appliction/json' });
            res.write(JSON.stringify({ message: "page not found" }));
        }
    })
});

server.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
});