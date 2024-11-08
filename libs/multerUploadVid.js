const multer = require('multer');

const uploadVid = multer({
    fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['video/mp4', 'video/x-msvideo', 'video/quicktime'];

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

module.exports = uploadVid;