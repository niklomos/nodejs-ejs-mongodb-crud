// ใช้งาน Mongoose
const mongoose = require('mongoose');

// ตั้งค่า strictQuery
mongoose.set('strictQuery', true); // หรือ mongoose.set('strictQuery', false);

// เชื่อมไปยัง Mongoose
const dbUrl = 'mongodb://localhost:27017/productDB';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err));

// ออกแบบ schema สำหรับ Product
let productSchema = mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    title: String,
    description: String
});

// ออกแบบฟังชันสำหรับบันทึกข้อมูล
productSchema.statics.saveProduct = function(data, callback) {
    data.save(callback);
};

// สร้าง Model สำหรับ Product
let Product = mongoose.model("products", productSchema);



// ออกแบบ schema สำหรับ Account
let accountSchema = mongoose.Schema({
    username: String,
    password: String,
    permission_status: String
});

// ฟังก์ชันบันทึก Account (เพิ่มเติม)
accountSchema.statics.saveAccount = function(data, callback) {
    data.save(callback);
};
// สร้าง Model สำหรับ Account
let Account = mongoose.model("accounts", accountSchema);





// ส่งออก Model
module.exports = {
    Product: Product,
    Account: Account
};




// //ใช้งาน Mongoose
// const  mongoose = require('mongoose')

// // ตั้งค่า strictQuery
// mongoose.set('strictQuery', true); // หรือ mongoose.set('strictQuery', false);

// // เชื่อมไปยัง Mongoose
// const dbUrl = 'mongodb://localhost:27017/productDB'
// mongoose.connect(dbUrl,{
//     useNewUrlParser: true, 
//     useUnifiedTopology: true 
// }).catch(err => console.log(err))

// //ออกแบบ schema
// let productSchema =  mongoose.Schema({
//     name:String,
//     price:Number,
//     image:String,
//     description:String
//     })

// //สร้าง Model
// let Product = mongoose.model("products", productSchema)

// //ส่งออก Model
// module.exports = Product

// //ออกแบบฟังชันสำหรับบันทึกข้อมูล
// module.exports.saveProduct=function(model,data){
//  model.save(data)
// }
