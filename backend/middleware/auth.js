import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token || token === "null" || token === "undefined") {
        return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    // Bypass verification for mock tokens if DB is offline
    if (!global.isDBConnected && token.startsWith('mock-')) {
        req.body.userId = token.includes('admin') ? 'mock_admin_id' : 'mock_user_id';
        return next();
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log("JWT Error:", error.message);
        res.json({ success: false, message: "Session expired or invalid token" });
    }
}

export default authMiddleware;
