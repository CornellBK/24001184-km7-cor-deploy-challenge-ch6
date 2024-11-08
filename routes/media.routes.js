const router = require('express').Router();
const MediaHandling = require('../controllers/mediaHandling');

const multerUpload = require('../libs/multerUpload');

router.post('/upload-image', multerUpload.single('image'), MediaHandling.uploadImage);

module.exports = router;