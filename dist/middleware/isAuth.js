import jwt, {} from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", req.headers.authorization);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "unauthorized please login" });
        }
        const token = authHeader.split(" ")[1];
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedValue || !decodedValue.user) {
            res.status(401).json({ message: "Invalid token" });
        }
        req.user = decodedValue.user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "unauthorized please login" });
    }
};
//# sourceMappingURL=isAuth.js.map