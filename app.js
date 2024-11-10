require('dotenv').config();
const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const HASH = process.env.HASH;
const restrictJwt = require('./middleware/restrictJwt')

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Joi = require('joi');

// app.use('/images', express.static('public/images'));
// app.use('/files', express.static('public/files'));

const login_schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
const user_schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

app.get('/test', (req, res) => {
    return res.status(200).json({
        message: "Hello there"
    })
});

app.post('/api/v1/auth/login', async (req, res) => {
    const { error, value } = login_schema.validate(req.body);
    if (error) {
        return res.status(400).json({
        error: error.details[0].message
        });
    }
    try{
      let {email, password} = value;
      // console.log('masuk g ni')
      let userData = await prisma.user.findUnique({
          where: {
              email
          }
      })
  
      if(!userData){
        return res.status(400).json({
              error : "invalid login"
          })
      }
      else{
          let isPassword = bcrypt.compareSync(password, userData.password)
          // console.log(isPassword, "==> THIS password g")
          // res.status(200).json(userData);
          if(!isPassword){
              return res.status(400).json({error: "invalid login"})
          }
          else{
              const options = {
                expiresIn: '20d'
              };
              const accessToken = jwt.sign({
                  id : userData.id,
                  name : userData.name
              }, JWT_SECRET, options)
  
              return res.status(200).json({
                  message: "success",
                  accessToken
              })
          }
      }
    }
    catch(error){
      return res.status(500).json({message: error.message})
    }
})

app.post('/api/v1/auth/register', async (req, res) => {
    try{
      const { error, value } = user_schema.validate(req.body);
      if (error) {
          return res.status(400).json({
            error: error.details[0].message
          });
      }
      let password = bcrypt.hashSync(value.password, parseInt(HASH))
      const cekEmailUnik = await prisma.user.findUnique({
        where: {
            email : value.email
        }
      })
      if(cekEmailUnik){
        return res.status(400).json({
            error: "Existing email",
            status : false
        })
      }
  
  
      const new_user = await prisma.user.create({
        data: {
            email: value.email,
            password: password
        }
      });
      res.status(201).json({data : new_user, message: 'success'});
    }
    catch(error){
      res.status(500).json({message: error.message})
    }
  
});

const mediaRouter = require('./routes/media.routes');
app.use('/api/v1', mediaRouter);

const {PORT = 3000} = process.env;
app.listen(PORT, () => console.log('listening on port', PORT));