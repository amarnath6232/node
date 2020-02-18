var jwt = require('jsonwebtoken');

var authorization = function (req, res, next) {

    var token = req.headers['authorization'];
    var msg = {
        auth: false,
        message: 'No token provided.'
    };
    if (!token) {
        res.status(401).send(msg);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
        var msg = {
            auth: false,
            message: 'Failed to authenticate token.',
            error: err
        };
        console.log(decoded);
        if (err) {
            res.status(401).send(msg);
        }
        next();
    });
}

module.exports = authorization;