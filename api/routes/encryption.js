const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JWT_secret_Key = "JWT_secret_Key";

const secret = 'password';

module.exports.encryption = function encryption(password) {
    const hash = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    return hash;
}


module.exports.jwtMethod = function jwtMethod(user) {
    const token = jwt.sign({
        user: user
    }, JWT_secret_Key, {
        expiresIn: '1h'
    });
    return token;
}

var authorization = function (req, res, next) {

    var token = req.headers['authorization'];
    var msg = {
        auth: false,
        message: 'No token provided.'
    };
    if (!token)
        res.status(500).send(msg);

    jwt.verify(token, JWT_secret_Key, function (err, decoded) {
        var msg = {
            auth: false,
            message: 'Failed to authenticate token.'
        };
        if (err)
            res.status(500).send(msg);
        req.userId = decoded.id;
        next();
    });
}

module.exports = authorization;