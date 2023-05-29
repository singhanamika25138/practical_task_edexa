const express = require('express');
const mongoose = require('mongoose')
const app = express()
const helper = require('../helpers/response');
const { Validator } = require('node-input-validator');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userTable = require('../models/user');

let saltRounds = 10;

//Api to register Employee with required body params

exports.register = async (req, res, next) => {
   try {

      const v = new Validator(req.body, {

         first_name: 'required',
         last_name: 'required',
         email: 'required|email',
         phone_number: 'required|integer'
      })
      const matched = await v.check();
      let first_name = v.errors.first_name ? v.errors.first_name.message : ''
      let last_name = v.errors.last_name ? v.errors.last_name.message : ''
      let email = v.errors.email ? v.errors.email.message : ''
      let phone_number = v.errors.phone_number ? v.errors.phone_number.message : ''
     if (!matched) {
         let err = email  + first_name + phone_number + last_name
         helper.validation_error(res, err)
      }
      else {

         let checkDuplicate = await userTable.findOne({ 'email_id': req.body.email, 'phone_number': req.body.phone_number })
         if (checkDuplicate) {
            helper.duplicate(res, "already registered with this mail and phone_number")
            return;
         }

         let user_data = await userTable.create(req.body)
         if (user_data) {
            return helper.success(res, "registered successfully", check)
         }
      }
   }
   catch (err) {
      console.log(err)
      helper.went_wrong(res, err)
   }
}

//Api to get all registered Employees
exports.getAllUsers = async (req, res, next) => {
   try {
      let user = await userTable.find()
      if (user) {
         return helper.success(res, "All Registers Users are !", user)
      }
      return helper.not_found(res, "Sorry !..No Users Found in the table")
   }
   catch (err) {
      helper.went_wrong(res, err)
   }

}
//Api to update employee by employeeID
exports.editUser = async (req, res) => {
   const { id } = req.params;
   const { first_name, last_name, phone_number } = req.body;
   try {
      const employee = await userTable.findByIdAndUpdate(id, { first_name, last_name, phone_number }, { new: true });
      if (!employee) {
         return helper.not_found(res, "Employee not found")
      }
      return helper.success(res, "Employee updated Successfully!", employee)
   } catch (error) {
      helper.went_wrong(res, err)
   }
}
//Api to delete Employee from database
exports.deleteUser = async (req, res) => {
   const { id } = req.params;
   try {
      const deletedEmployee = await Employee.findByIdAndDelete(id);
      if (!deletedEmployee) {
         return helper.not_found(res, "Employee not found")
      }
      return helper.successWithnodata(res, "Employee deleted successfully", employee)
   } catch (error) {
      helper.went_wrong(res, err)
   }
}
