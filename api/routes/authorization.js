var jwt = require('jsonwebtoken');
const JWT_secret_Key = "JWT_secret_Key";


module.exports.jwtMethod = function jwtMethod(user) {
    const token = jwt.sign({
        user: user
    }, JWT_secret_Key, {
        expiresIn: '1h'
    });
    return token;
}

module.exports.authorization = async function authorization(req, res, next) {
    var token = req.headers.authorization;
    var msg = {
        auth: false,
        message: 'No token provided.'
    };
    console.log(token);
    if (!token) {
        res.status(401).send(msg);
    } else {
        jwt.verify(token, JWT_secret_Key, function (err, decoded) {
            var msg = {
                auth: false,
                message: 'Failed to authenticate token.'
            };
            if (err) {
                res.status(401).send(msg);
            }
        });
    }
}