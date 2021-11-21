const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' });
        }
        
        const decoded = jwt.verify(token, process.env.NODE_APP_JWT_KEY);
        req.user = decoded;
        next();
    }
    catch (e) {
        console.log(e);

        return res.status(401).json({ message: 'Нет авторизации' });
    }
}