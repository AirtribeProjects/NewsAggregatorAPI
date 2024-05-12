const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized: Missing token' });
            next();
        }
        jwt.verify(authHeader, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Forbidden: Invalid token' });
                next();
            }
            req.user = user;
            req.message = "Found the user succcessfully, user has valid login token";
            next();
        });
    } catch {
        res.status(500).json({ error: 'Error occured while verifying the token' });
        next();
    }
};

module.exports = verifyToken;