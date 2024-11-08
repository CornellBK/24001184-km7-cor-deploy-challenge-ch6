const imageKit = require('../libs/imagekit');
const joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const desc_schema = joi.object({
    title: joi.string().required(),
    desc: joi.string().required()
});

class MediaHandling {
    static async uploadImage(req, res){
        const { error, value } = desc_schema.validate(req.body);
        if (error) {
            return res.status(400).json({
            error: error.details[0].message
            });
        }
        try{
            let {title, desc} = value;
            
            const stringFile = req.file.buffer.toString('base64');
            const uploadFile = await imageKit.upload({
                fileName: req.file.originalname,
                file: stringFile
            });

            let url = uploadFile.url;

            const newImg = await prisma.image.create({
                data : {
                    title,
                    desc,
                    url
                }
            });

            const data = newImg;
            data.img_type = uploadFile.fileType

            return res.json({
                status: true,
                message: 'success',
                data
            });
            
        }
        catch(error){
            return res.status(500).json({
                error: error.message
            });
        }
    }
}

module.exports = MediaHandling;