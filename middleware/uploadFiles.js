const multer = require('multer')
const moment = require('moment')

//Конфигурация папки загрузки а также имени файла
const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'data/images')
    },
    filename(req,file,cb){
        const date = moment().format('DDMMYYYY-HHmmss_SSS')
        cb(null,`${date}-${file.originalname}`)
    }
})


//Конфигурация поддерживаемых для загрузки файлов
const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}


//Конфигурация на размер загружаемых файлов
const limits = {
    fileSize: 1024 * 1024 * 5
}


module.exports = multer({storage,fileFilter,limits})