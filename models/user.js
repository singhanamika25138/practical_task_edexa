const mongoose = require('mongoose');
const { number } = require('../controllers/authController');
const Schema =  mongoose.Schema;
const user = new Schema({
    first_name:{type:String,default:''},
    last_name:{type:String,default:''},
    email:{type:String,default:''},
    phone_number:{type:Number,required:true},
    status:{type:Number,default:0},
    created_at:{type:Date,default:Date.now},
    updated_at:{type:String,default:''}
})
module.exports = mongoose.model('users',user);