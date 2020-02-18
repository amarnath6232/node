const crypto = require('crypto');

const secret = process.env.PASSWORD_ENCRYPTION_KEY;

module.exports.pwdEncryption = function (password) {
    // console.log("password",password);
    var hash = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    // console.log("hash", hash);
    return hash;
}