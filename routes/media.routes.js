const router = require('express').Router();
const MediaHandling = require('../controllers/mediaHandling');
const multerUpload = require('../libs/multerUpload');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const restrictJwt = require('../middleware/restrictJwt')

const joi = require('joi');

router.use(restrictJwt);

router.post('/upload-image', multerUpload.single('image'), MediaHandling.uploadImage);
router.delete('/image/:image_id', MediaHandling.deleteImage);
//update image di imagekit jg ini
router.put("/image", multerUpload.single('image'), MediaHandling.updateImage)

router.get('/image', async (req, res) => {
    try {
        const images = await prisma.image.findMany();
        if(images.length === 0){
            return res.status(404).json({ error: 'There are no images'})
        }

        res.json(images);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
})

router.get('/image/:image_id', async (req, res) => {
    const imageId = parseInt(req.params.image_id);
    if (isNaN(imageId)) {
        return res.status(400).json({ error: 'Invalid image ID.' });
    }
    
    try {
        const image = await prisma.image.findUnique({
            where: {id: imageId}
        });
        if(!image){
            return res.status(404).json({ error: 'Image not found.' });
        }

        res.json(image);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
})

module.exports = router;