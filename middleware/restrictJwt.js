let jwt = require('jsonwebtoken');
let JWT_SECRET = process.env.JWT_SECRET;

module.exports = async(req, res, next) => {
    const {authorization} = req.headers;
    // console.log(authorization);

    if(!authorization){
        res.status(401).json({
            message: "You are not authorized"
        })
    }
    else{
        jwt.verify(authorization, JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401).json({
                    message: "You are not authorized"
                })
            }
            else{
                req.user = decoded;
                next();
            }
        })
    }
}