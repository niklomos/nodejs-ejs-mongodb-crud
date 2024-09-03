const express = require('express')
const router = express.Router()
//เรียกใช้งานModel
const {Product,Account} = require('../models/products')

//อัปโหลดไฟล์
const multer = require('multer')
const session = require('express-session')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
     cb(null,'./public/images/products')//ตำแหน่งจัดเก็บไฟล์
    },
    filename:function(req,file,cb){
      cb(null,Date.now()+".jpg") //เปลี่ยนชื่อไฟล์
    }
})
//เริ่มต้นอัปโหลด
const upload = multer({
    storage:storage
})

//ส่วน Account
router.get("/form_account",(req,res)=>{
    res.render('form_account')
})

router.post('/insert_account', async (req, res) => {
    try {
        // สร้างข้อมูลใหม่โดยใช้ข้อมูลจาก body
        let data = new Account({
            username: req.body.username,
            password: req.body.password, // ใช้ req.body.password แทน req.body.username
            permission_status: req.body.permission_status
        });

        // บันทึกข้อมูลลงในฐานข้อมูล
        await data.save();

        // ส่งการตอบกลับ JSON ไปยังไคลเอนต์ พร้อมข้อความสำเร็จ
        res.json({ success: true, message: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว' });
    } catch (err) {
        // แสดงข้อผิดพลาดใน console และส่งการตอบกลับข้อผิดพลาด
        console.log(err);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
});




//ส่วน product
router.get("/",(req,res)=>{
    Product.find().exec(function(err,doc ){
        res.render('index.ejs',{products:doc})
    })
})
router.get("/add-product",(req,res)=>{
    //Cookie
    // if(req.cookies.login){
    //     res.render('form')
    // }else{
    //     res.render('admin')
    // }
    //Session
     if(req.session.login){
        res.render('form')
    }else{
        res.render('admin')
    }

    res.render('admin')
})
router.get("/edit",(req,res)=>{
    res.render('edit')
})
router.get("/admin",(req,res)=>{
    res.render('admin')
})


router.get('/logout',(req,res)=>{
    //Cookie
    // res.clearCookie('username')
    // res.clearCookie('password')
    // res.clearCookie('login')
    // res.redirect('/manage')
    //Session
    req.session.destroy((err)=>{
            res.redirect('/manage')

    })

})

router.get("/manage",(req,res)=>{
    // if(req.cookies.login){
    //     Product.find().exec(function(err,doc ){
    //         res.render('manage.ejs',{products:doc})
    //     })
    // }else{
    //     res.render('admin')
    // }
    //แสดงข้อมูล session
    if(req.session.login){
        Product.find().exec(function(err,doc ){
            res.render('manage.ejs',{products:doc})
        })
    }else{
        res.render('admin')
    }
})

router.post('/insert', upload.single('image'), async (req, res) => {
    try {
        let data = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.file.filename,
            title: req.body.title,
            description: req.body.description
        });

        await data.save(); // ใช้ async/await เพื่อรอการบันทึกข้อมูล

        res.json({ success: true, message: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }); // ส่งข้อมูล JSON ในกรณีข้อผิดพลาด
    }
});

router.get('/delete/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id, { useFindAndModify: false }, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error occurred while deleting the product.');
        }
        // หลังจากลบแล้ว อาจจะต้องการแสดงข้อมูลใหม่หรือเปลี่ยนเส้นทาง
        res.redirect('/manage'); // เปลี่ยนเส้นทางไปยังหน้าจัดการสินค้าหลังจากลบสำเร็จ
    });
});


router.get("/:id",(req,res)=>{
    const product_id = req.params.id
   Product.findOne({_id:product_id}).exec((err,doc)=>{
        if(err) console.log(err)
        res.render('product',{products:doc})
    })
})

// router.get('/:id',(req,res)=>{
//     const edit_id = req.params.id
//     console.log(edit_id)
//     Product.findOne({_id:edit_id}).exec((err,doc)=>{
//         if(err) console.log(err)
//         res.render('edit.ejs',{products:doc})
//     })
// })
router.post('/edit',(req,res)=>{
    const edit_id = req.body.id
    console.log(edit_id)
    Product.findOne({_id:edit_id}).exec((err,doc)=>{
        if(err) console.log(err)
        res.render('edit',{products:doc})
    })
})

// Update product route
router.post('/update', upload.single('image'), (req, res) => {
    const update_id = req.body.id;
    let data = {
        name: req.body.name,
        price: req.body.price,
        title: req.body.title,
        description: req.body.description
    };

    // Check if a new image file was uploaded
    if (req.file) {
        data.image = req.file.filename; // Use the new image filename
    }

    Product.findByIdAndUpdate(update_id, data, { useFindAndModify: false }).exec(err => {
        if (err) {
            console.log(err);
            res.status(500).send('Error updating product');
        } else {
            res.redirect('/manage');
        }
    });
});


router.post('/login',async (req,res)=>{
      const username = req.body.username
      const password = req.body.password
      const timeExpire = 1800000
      const account = await Account.findOne({ username, password });

      if(account && account.permission_status === 'a'){
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge=timeExpire
        res.redirect('/manage')
      }else{
        res.render('404')
      }
 
})






module.exports = router