const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config/key')
const errorHandler = require('../utils/errorHandler')

//Авторизация пользователя
module.exports.login = async function(req,res){
    const candidate = await User.findOne({email: req.body.email})

    if (candidate){
        const passwordResult = await bcrypt.compare(req.body.password,candidate.password)
        if (passwordResult){

            const token = jwt.sign({
                email: candidate.email,
                userID: candidate._id
            },config.JWT,{expiresIn: 60 * 60})

            res.status(200).json({
                token: `bearer ${token}`
            })
        }
        else{
            res.status(401).json({
                message: 'Пароли не совпадают.'
            })
        }
    }
    else{
        res.status(404).json({
            message: 'Пользователь с таким email не найден.'
        })
    }
}


//Регистрация пользователя
module.exports.register = async function(req,res){
const candidate = await User.findOne({email: req.body.email})
    if (candidate){
        res.status(409).json({
            message: 'Такой email уже занят. Попробуйте другой'
        })
    }
    else{
        //Регистрация
        const salt = await bcrypt.genSalt(10)
        const user = new User({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password,salt)
        })

        try{
            await user.save()
            res.status(201).json(user)
        }
        catch(e){
            errorHandler(res,e)
        }
    }
}