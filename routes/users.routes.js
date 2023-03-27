const express=require("express")
const userRoutes=express.Router()
const {UserModel}=require("../models/users.model")
const bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken');
require("dotenv").config()




userRoutes.post("/register", async(req,res)=>{
    const{name,email,gender,password,age,city,is_married}=req.body
    const user= await UserModel.findOne({email})
    if(user){
        res.status(200).send({"msg":"User already exist, please login"})
    }else{
        try {
        
            bcrypt.hash(password, 5, async (err, hash) => {
                const user=new UserModel({name,email,gender,password:hash,age,city,is_married})
                await user.save()
                res.status(200).send({"msg":"Registration has been done!"})
            });
            
        } catch (error) {
            res.status(400).send({"msg":error.message})
        }
    }
   
})


userRoutes.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(result){
                    res.status(200).send({"msg":"Login successfull!","token":jwt.sign({"userID":user._id}, process.env.key, { expiresIn: '1h' })})
                }else{
                    res.status(400).send({"msg":"Wrong Credentials"})
                }
            });

        }else{
            res.status(400).send({"msg":"Wrong Credentials"})
        }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})








module.exports={userRoutes}