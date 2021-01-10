const multer = require('multer');
const path = require('path');

const multerStorage = multer.diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("images")) {
        cb(null, true);
    }else{
        cb('Please upload only images.', false);
    }
}

const upload = multer({
    storage: multerStorage,   
});

module.exports = upload;