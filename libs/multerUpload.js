const multer = require('multer');

const upload = multer({
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

        if(allowedMimeTypes.includes(file.mimetype)) {
            callback(null, true);
        }
        else{
            const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload`);
            callback(err, false);
        }
    },
    onError: (err, next) => {
        next(err);
    }
})

module.exports = upload;