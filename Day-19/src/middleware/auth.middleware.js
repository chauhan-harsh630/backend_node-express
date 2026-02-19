import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = decode;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Error verifying token", error });
    }
}

export default auth