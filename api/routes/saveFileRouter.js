const express = require('express');
const router = express.Router();
const savePdf = require('./pdfDecode');

// Handle incoming GET requests to /Users
router.post('/pdf', (req, res, next) => {
    const pdfBase64String = req.body.base64;
    // console.log("pdfBase64String", pdfBase64String);
    const result = savePdf.pdf_decryption(pdfBase64String);
    res.status(200).json(result);
});


module.exports = router;