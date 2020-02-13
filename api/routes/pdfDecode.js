const fs = require("fs");
const path = require('path');
const os = require('os');

var pdf_folder = '';
var pdf_fileName = '';


function generate_Random_Pdf_FileName(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text + ".pdf";
}

module.exports.pdf_decryption = function decryption(stringToDecode) {
    const platform = os.platform();
    console.log(platform);
    if (platform === 'win32') {
        create_Win_path(stringToDecode);
    } else if (platform === 'linux') {
        create_Linux_path(stringToDecode);
    } else {
        throw err;
    }
    console.log("before complete");
    return {
        dir: pdf_folder,
        fileName: pdf_fileName
    }

}

// windows
function create_Win_path(stringToDecode) {
    console.log('win');
    var DocFolder = './Docs';

    if (!fs.existsSync(DocFolder)) {
        fs.mkdirSync(DocFolder);
    }

    pdf_folder = path.join(__dirname, DocFolder);
    pdf_fileName = generate_Random_Pdf_FileName(15);

    var basePath = path.resolve(__dirname, '../../');
    let filePath_to_Doc = path.resolve(basePath, DocFolder + "/");

    console.log("resolve", path.resolve(filePath_to_Doc, pdf_fileName));

    var pdfBuffer = new Buffer(stringToDecode, 'base64');
    fs.writeFileSync(path.resolve(filePath_to_Doc, pdf_fileName), pdfBuffer, function (err) {
        if (err) throw err;
        pdf_folder = path.resolve(filePath_to_Doc, pdf_fileName);
    });
    console.log("completed");
}

// linux
function create_Linux_path(stringToDecode) {
    console.log('linux');
    path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
    // Returns: '../../impl/bbb'
}