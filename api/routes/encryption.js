const crypto = require('crypto');

const secret = 'password';

module.exports.encryption = function (password) {
    const hash = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    return hash;
}