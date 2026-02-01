import http from "http";
const port = 3000;
const app = http.createServer((req, res) => {
    if (req.method === "GET"&& req.url==="/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            status: "ok",
            message: "Server is health"
        }));

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: "error",
            message:"Route not found"
        }))
    }
});

app.listen(port, () => {
    console.log(`Server is running at port http://localhost:${port}`);
});