const express = require('express');
const mongoose = require('mongoose')
const app=express()
const helper = require('../helpers/response');
const {Validator} = require('node-input-validator');
var jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
const userTable = require('../models/user');

let saltRounds = 10;

//user register

exports.register = async(req,res,next)=>{
    try{

 const v = new Validator(req.body,{
   
    first_name:'required',
    last_name:'required',
    email:'required|email',
    phone_number:'required|integer',
    password:'required',
    
 })
 const matched = await v.check();
 let first_name=v.errors.first_name?v.errors.first_name.message:'' 
 let last_name=v.errors.last_name?v.errors.last_name.message:'' 
 let email=v.errors.email?v.errors.email.message:''
 let phone_number=v.errors.phone_number?v.errors.phone_number.message:'' 
 let password=v.errors.password?v.errors.password.message:''
if(!matched){
      let err=email+password+first_name+phone_number+last_name
   helper.validation_error(res,err)
}
 else{
   
      let checkDuplicate =await  userTable.findOne({'email_id':req.body.email,'phone_number':req.body.phone_number})
               if(checkDuplicate){
                    helper.duplicate(res,"already registered with this mail and phone_number")
                           return;
                             }
                        
                 let user_data = await userTable.create(
                             {

                              first_name:req.body.first_name,
                              last_name:req.body.first_name,
                              phone_number:req.body.phone_number,
                                email:req.body.email,
                                password:bcrypt.hashSync(req.body.password,saltRounds)
                                
                             })
                  if(user_data ){
                           let check = user_data.toJSON();
                             let token = jwt.sign(user_data.toJSON(),'LOG_KEY');//generating token after  succcessfull register of the user
                             console.log(token);
                             check.token = token
                            helper.success(res,"registered successfully",check)
                      
                                    return;   
                                      }
                       helper.db_errorwithoutE(res)
      
          }
}
   catch(err){
    console.log(err)
    helper.went_wrong(res,err)
 }
}
//user login
exports.login = async(req,res,next)=>{
try{
    const v = new Validator(req.body,{
        email:'required|email',
        password:'required'
    })
    const matched = await v.check();
    let email = v.errors.email?v.errors.email.message:''
    let password= v.errors.password?v.errors.password.message:''
    if(!matched){
         let err = password+email
         helper.validation_error(res,err)
    }
    else{
        let found = await userTable.findOne({'email':req.body.email})
        if(found){     
            bcrypt.compare(req.body.password , found.password,(err,user)=>{
                if(user == true){
                   let token = jwt.sign(found.toJSON(),'LOG_KEY');
                             console.log(token);
                             let check = found.toJSON();
                             check.token = token
                           //   res.status(200).json({statusCode:200,message:"login succesfully",result : check})
                             helper.success(res,"login successfully",check)
                }
                else{
                   helper.login_failed(res,"password not matched")
                }
            })
            return;
          
        }
            helper.login_failed(res,"Not Registered with this Email!")
    }
}
catch(err){
    console.log(err)
    helper.went_wrong(res,err)
   }
}

exports.users = async(req,res,next)=>{
    try{
 let user = await userTable.find()
   if(user){
     console.log(user)
     helper.success(res,"All Registers Users are !",user)
   }
    else{
      console.log("no data")
      helper.not_found(res,"Sorry !..No Users Found in the table")
    }
}
     catch(err){
        helper.went_wrong(res,err)
     }
      
}
