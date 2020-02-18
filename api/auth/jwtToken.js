var jwt = require('jsonwebtoken');

module.exports.jwtMethod = function jwtMethod(user) {
    const token = jwt.sign({
        user: user
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    });
    return token;
}