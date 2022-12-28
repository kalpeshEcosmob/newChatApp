const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getauth = async (req, res, next) => {
    token = req.session.token;

    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) {
            const error = new Error("Please login");
            error.httpStatusCode = 500;
            return next(error);
        }
        else {
            next();
        }
    })
}