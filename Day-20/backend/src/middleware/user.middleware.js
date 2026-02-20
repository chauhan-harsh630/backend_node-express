import jwt from "jsonwebtoken";


export const auth = async (req, res, next) => {
   
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({
            message: "Not authorized",
        });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message:error.message
        })
    }
}