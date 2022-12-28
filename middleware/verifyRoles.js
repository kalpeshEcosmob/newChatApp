const jwt = require('jsonwebtoken');

const verify = (...allowedRoles) => {
    return (req, res, next) => {
        token = req.session.token;

        jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
            if (err) {
                const error = new Error("Please login");
                error.httpStatusCode = 500;
                return next(error);
            }
            else {
                const allowed = [...allowedRoles];
                const role = data.role;
                if (allowed == role) {
                    console.log('verified')
                    next();

                }
                else {
                    console.log('not verified');
                    const error = new Error("Not allowed");
                    error.httpStatusCode = 501;
                    return next(error);
                }
            }
        })


    }

}

module.exports = verify;