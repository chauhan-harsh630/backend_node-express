import http from "http";
import fs from "fs/promises";
import url from "url";
import path from "path";

const port = 3000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = http.createServer(async (req, res) => {

    if (req.method !== "GET") {
        res.writeHead(405, { "Content-Type": "text/plain" });
        return res.end("Method Not Allowed");
    }

    let filePath;
    
    if (req.url === "/") {
        filePath = path.join(__dirname, "public", "home.html");
    } 
    else if (req.url === "/about") {
        filePath = path.join(__dirname, "public", "about.html");
    } 
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Page Not Found");
    }

    try {
        const data = await fs.readFile(filePath);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    } catch {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
