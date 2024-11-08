module.exports = {
    strogeImage: (req, res) => {
        console.log('test');
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;


        return res.status (200).json({
            status: true,
            message: 'success',
            data: {
                image_url: imageUrl
            }
        })
    }
}