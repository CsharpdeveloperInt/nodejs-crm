const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

//Получить позицию(товара) по категории
module.exports.getByCategoryId = async function(req,res){
    try
    {
        const positions= await Position.find({
            category: req.params.categoryID,
            user: req.user.id
        })
        
        console.log(req.params.categoryID)
        res.status(200).json(positions)
    }
    catch(error){
        errorHandler(res,error)
    }
}


//Создать позицию(товар)
module.exports.create = async function(req,res){
    try
    {
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        }).save()

        res.status(201).json(position)
    }
    catch(error){
        errorHandler(res,error)
    }
}


//Обновить позицию(товар)
module.exports.update = async function(req,res){
    try
    {
        const position = await Position.findOneAndUpdate({_id: req.params.id},{$set:req.body},{new:true})
        res.status(200).json(position)
    }
    catch(error){
        errorHandler(res,error)
    }
}


//Удалить позицию(товар)
module.exports.remove = async function(req,res){
    try
    {
      await Position.remove({_id: req.params.id})
      res.status(200).json({message:'Запись удалена'})  
    }
    catch(error){
        errorHandler(res,error)
    }
}