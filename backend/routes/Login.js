import express from 'express';
import users from "../models/userModel.js";
const router = express.Router();

router.post('/', async (req,res)=>{
    const {Email,Password}=req.body;
    try
    {
        const existing=await users.find({Email,Password});
        if(existing.length===0)
        {
            return res.status(404).json({message: "Invalid Credentials"})
        }
        res.status(200).json({message: "Successful",existing})
    }catch(err){
        console.log(err)
        return res.status(400).json({message: "Server Error"})
    }
})
export default router;