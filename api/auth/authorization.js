var jwt = require('jsonwebtoken');

var authorization = function (req, res, next) {

    var token = req.headers['authorization'];
    var msg = {auth: false, message: 'No token provided.'};
    if (!token)
        res.status(500).send(msg);

    jwt.verify(token, config.SECRET, function (err, decoded) {
        var msg = {auth: false, message: 'Failed to authenticate token.'};
        if (err)
        res.status(500).send(msg);
        req.userId = decoded.id;
        next();
    });
}

module.exports = authorization;

