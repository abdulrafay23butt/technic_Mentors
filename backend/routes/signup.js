import express from 'express';
import users from "../models/userModel.js";
const router = express.Router();

router.post('/', async (req,res)=>{
    const {Name,Email,Password}=req.body;
    console.log(Email);
    try
    {
        const existing=await users.find({Email});
        console.log(existing);
        if(existing.length>0 || !existing)
        {
            return res.status(404).json({message: "Email Already Exists"})
        }
        const newUser=new users({Name,Email,Password});
        
        await newUser.save();
        res.status(200).json({message: "Successful"})
    }catch(err){
        console.log(err)
        return res.status(400).json({message: "Server Error"})
    }
})

export default router;