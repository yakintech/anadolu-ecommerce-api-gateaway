const jwt = require('jsonwebtoken');



const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send();
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        return next();

    } catch (error) {
        return res.status(401).send();
    }
}

module.exports = authMiddleware;