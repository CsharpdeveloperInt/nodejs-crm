const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')


//Получить все заказы + фильтрация
module.exports.getAll = async function(req,res){
    try
    {
       const query = {
           user: req.user.id
       }

       //Фильтруем по дате начала (изменение объекта query)
       if (req.query.start){
           query.date = {
               //Больше или равно дате фильтра
               $gte: req.query.start
           }
       }
       //Фильтруем по дате конца (изменение объекта query)
       if(req.query.end){
           if(!query.date){
               query.date = {}
           }
           query.date['$lte'] = req.query.end
       }

       if(req.query.order){
           query.order = +req.query.order
       }
       
       //Формируем объект для поиска в БД и возвращаем в клиент
       const orders = await Order
        .find(query)
        .sort({date:-1})
        .skip(+req.query.offset)
        .limit(+req.query.limit)

       
        res.status(200).json(orders)
    }
    catch(error){
        errorHandler(res,error)
    }
}


//Создать заказ
module.exports.create = async function(req,res){
    try
    {
        //Получаем последний заказ

        const lastOrder = await Order
         .findOne({user: req.user.id})
         .sort({date:-1})

        //Если он есть берем его номер иначе последний заказ с номером 0
        const maxOrder = lastOrder ? lastOrder.order : 0
        
        //Формируем объект для добавления в БД
        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save()

        res.status(201).json(order)
    }
    catch(error){
        errorHandler(res,error)
    }
}