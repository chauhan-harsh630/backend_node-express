import http from "http"; 
const port = 3000
const app = http.createServer((req, res) => {
    //    res.setHeader('Content-type',"text/html")
    res.writeHead(200,{'content-type':'application/json'})
    // res.end("<h1>Hello World!</h1>");
    res.end(JSON.stringify({ message: "Server is running" }));
});

app.listen(port, () => {
    console.log(`Server running to port: http://localhost:${port}`);
})