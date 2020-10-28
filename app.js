const express = require('express')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const config = require('./config/key')
const mongoose = require('mongoose')
const passport = require('passport')
const app = express()

//Connect to database
mongoose.connect(config.MONGO_URI,{useUnifiedTopology: true,useNewUrlParser:true,useFindAndModify: false,useCreateIndex:true})
    .then(()=>console.log('MongoDB connected'))
    .catch(error=>console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use('/data/images',express.static('data/images'))
app.use(require('morgan')('dev'))
app.use(require('cors')())
/*
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())*/
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)


module.exports = app