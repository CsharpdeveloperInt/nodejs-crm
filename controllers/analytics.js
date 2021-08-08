const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

const formatMask = "DD.MM.YYYY"

module.exports.overview = async function(req,res){
    try{
        
        const allOrders = await Order.find({user:req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-1,'d').format(formatMask)] || []

        //Кол-во заказов вчера
        const yesterdayOrdersNumber = yesterdayOrders.length
        //Кол-во заказов
        const totalOrdersNumber = allOrders.length
        //Кол-во дней всего
        const daysNumber = Object.keys(ordersMap).length
        //Заказов в день
        const orderPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
        //((заказов вчера / кол-во заказов в день)-1)*100
        //Процент для кол-ва заказов
        const ordersPercent = (((yesterdayOrdersNumber / orderPerDay)-1)*100).toFixed(2)
        //Общая выручка
        const totalGain = calculatePrice(allOrders)
        //Выручка в день
        const gainPerDay = totalGain / daysNumber
        //Выручка за вчера
        const yesterdayGain = calculatePrice(yesterdayOrders)
        //Процент выручки
        const gainPercent = (((yesterdayGain / gainPerDay)-1)*100).toFixed(2)
        //Сравнение выручки 
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        //Сравнение кол-ва заказов
        const compareNumber = (yesterdayOrdersNumber - orderPerDay).toFixed(2)

        res.status(200).json({
            gain:{
                percent:Math.abs(+gainPercent),
                compare:Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders:{
                percent:Math.abs(+ordersPercent),
                compare:Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })
    }
    catch(error){
        errorHandler(res,error)
    }
}

module.exports.analytics = async function(req,res){
    try{
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const orderMap = getOrdersMap(allOrders)

        const average = +(calculatePrice(allOrders) / Object.keys(orderMap).length).toFixed(2)
        const chart = Object.keys(orderMap).map(label=>{
            const gain = calculatePrice(orderMap[label])
            const order = orderMap[label].length

            return {label,order,gain}
        })

        res.status(200).json({average,chart})
    }
    catch(error){
        errorHandler(res,error)
    }
}

function getOrdersMap(orders = []){
    const daysOrders = {}
    orders.forEach(order=>{
        const date = moment(order.date).format(formatMask)

        if(date === moment().format(formatMask)){
            return
        }

        if(!daysOrders[date]){
            daysOrders[date] = []
        }

        daysOrders[date].push(order)
    })
    return daysOrders
}

function calculatePrice(orders = []){
    return orders.reduce((total,order)=>{
        const orderPrice = order.list.reduce((orderTotal,item)=>{
            return orderTotal += item.cost * item.quantity
        },0)
        return total += orderPrice
    },0)
}