import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization") || `Bearer ${req.cookies?.token}`; // Check header or cookies
console.log(authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log("Verified User:", verified);

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

export default authMiddleware;
