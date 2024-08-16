import express from 'express';
import project from "../models/projectModel.js"
const router = express.Router();

router.post("/", async (req, res) => {
    const {id}=req.body;
    try {
       await project.findByIdAndUpdate(id,{Type:"complete"})
       res.status(200).json({ message: "Successfull" })
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

router.get("/", async (req, res) => {
    try {
        const projects = await project.find({ Type: "complete" });
        if(!projects)
        {
            return res.status(404).json({message: "No Data Found"})
        }
        res.status(200).json({ message: "Successful", projects });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

router.delete('/', async (req,res)=>{
    const {id}=req.body;
    try
    {
        await project.findByIdAndDelete(id)
        res.status(200).json({message: "Successfully Deleted"});
    }
    catch(err)
    {
        console.log(err);
        res.json(400).json({message:"UnSuccessful"})
    }
})
export default router;