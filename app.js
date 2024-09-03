const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const router = require('./routes/myRouter')
const app = express()

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(cookieParser())
app.use(session({
    secret:"mysession",
    resave:false,
    saveUninitialized:false
}))

// ตั้งค่า session ให้สามารถเข้าถึงได้ในทุก view
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.use(express.urlencoded({extended:false}))
app.use(router)
app.use(express.static(path.join(__dirname,'public')))

app.listen(8500,()=>{
    console.log("start server in port 8500")
})

