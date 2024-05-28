import jwt from 'jsonwebtoken';
import User from '../modules/users.js'


export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.query.token || req.headers["x-access-token"];

        if (!token) {
            res.status(400).json("A token is required for authentication");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: "Unauthorized", error: error });
        console.log(error);
    }
}