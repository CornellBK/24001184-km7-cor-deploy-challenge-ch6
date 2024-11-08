const imageKit = require('../libs/imagekit');
const joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const desc_schema = joi.object({
    title: joi.string().required(),
    desc: joi.string().required()
});
const update_schema = joi.object({
    id: joi.number().required(),
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
            let fileId = uploadFile.fileId;

            const newImg = await prisma.image.create({
                data : {
                    title,
                    desc,
                    url,
                    file_id : fileId
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

    static async deleteImage(req, res){
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

            let fileId = image.file_id;

            await imageKit.deleteFile(fileId);
            const deleteLocal = await prisma.image.delete({
                where: {id: imageId}
            })

            

            return res.json({
                status: true,
                message: 'deleted successfuly',
                title: deleteLocal.title,
                desc: deleteLocal.desc
            })

        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    static async updateImage(req, res){
        const { error, value } = update_schema.validate(req.body);
        if (error) {
            return res.status(400).json({
            error: error.details[0].message
            });
        }
    
        try{
            let {id, title, desc} = value;

            const stringFile = req.file.buffer.toString('base64');
            const uploadFile = await imageKit.upload({
                fileName: req.file.originalname,
                file: stringFile
            });

            let url = uploadFile.url;
            let fileId = uploadFile.fileId;

            const oldImg = await prisma.image.findUnique({
                where: {id}
            });
            await imageKit.deleteFile(oldImg.file_id);            
    
            const updateImg = await prisma.image.update({
                where: {id},
                data: {
                    title,
                    desc,
                    url,
                    file_id: fileId
                }
            })
    
            return res.json({
                status: true,
                message: 'success',
                updateImg
            });
            
        }
        catch(error){
            return res.status(500).json({
                error: error
            });
        }
    }
}

module.exports = MediaHandling;