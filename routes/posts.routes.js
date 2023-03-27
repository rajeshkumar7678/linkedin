const express=require("express")
const postRoutes=express.Router()
const {PostModel}=require("../models/posts.model")
const jwt=require("jsonwebtoken")
require("dotenv").config()


postRoutes.get("/", async(req,res)=>{
    const token=req.header.authorization.split(" ")[1];
    const decoded=jwt.verify(token,process.env.key)
    const min= Number(req.query.min) || -Infinity
    const max= Number(req.query.max) || +Infinity
    const page=Number(req.query.page) || 1
    const limit=Number(req.query.limit) || 3


    try {
        if(decoded){
            // const posts=await PostModel.find({"userID":decoded.userID})
            const posts=await PostModel.find({$or:[{userID:decoded.userID},{$and:[{no_of_comments:{$gte:min}},{no_of_comments:{$lte:max}}]}]}).skip((page-1)*limit).limit(3)
            res.status(200).send(posts)
        }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})




postRoutes.get("/top", async(req,res)=>{
    const token=req.header.authorization.split(" ")[1];
    const decoded=jwt.verify(token,process.env.key)
    const min= Number(req.query.min) || -Infinity
    const max= Number(req.query.max) || +Infinity
    const page=Number(req.query.page) || 1
    const limit=Number(req.query.limit) || 3


    try {
        if(decoded){
            const posts=await PostModel.find({$or:[{userID:decoded.userID}]}).sort({no_of_comments:-1}).skip((page-1)*limit).limit(3)
            res.status(200).send(posts)
        }
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})





postRoutes.post("/add", async(req,res)=>{
    try {
        const post=new PostModel(req.body)
        await post.save()
        res.status(200).send({"msg":"A new post has been added"})
    } catch (error) {
        res.status(400).send({"msg":error.message})
    }
})




postRoutes.patch("/update/:postID", async(req,res)=>{
    const postID=req.params.postID;
    const payload=req.body

    try {
        const query=await PostModel.findByIdAndUpdate({_id:postID},payload)
        res.status(200).send(query)
    } catch (error) {
        console.log(err)
        res.status(400).send({"err": "something went wrong"})
    }
})

postRoutes.delete("/delete/:postID", async(req,res)=>{
    const postID=req.params.postID;
    try {
        await PostModel.findByIdAndDelete({_id:postID})
        res.status(200).send(`post with post id ${postID} has been deleted from teh database`)
    } catch (error) {
        console.log(err)
        res.status(400).send({"err": "something went wrong"})
    }

})







module.exports={postRoutes}