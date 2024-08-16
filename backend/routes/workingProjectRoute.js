import express from 'express';
import project from "../models/projectModel.js";
import userProjects from "../models/userproject.js";
import users from "../models/userModel.js";
const router = express.Router();

router.post("/", async (req, res) => {
    const { id } = req.body;
    try {
        await project.findByIdAndUpdate(id, { Type: "working" })
        res.status(200).json({ message: "Successfull" })
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

router.get("/", async (req, res) => {
    try {
        const projects = await project.find({ Type: "working" });
        if (!projects) {
            return res.status(404).json({ message: "No Data Found" })
        }
       
        const combinedData = await Promise.all(projects.map(async (pro) => {
            const uproject = await userProjects.find({ workingProject: pro._id });
            const userIds = uproject.map(p => p.Userid);  
            const u = await users.find({ _id: { $in: userIds } });
            return {
                user: u,
                projects: pro
            };
        }));
        res.status(200).json({ message: "Successful", projects, combinedData });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

router.delete('/', async (req, res) => {
    const { id } = req.body;
    try {
        await project.findByIdAndDelete(id)
        res.status(200).json({ message: "Successfully Deleted" });
    }
    catch (err) {
        console.log(err);
        res.json(400).json({ message: "UnSuccessful" })
    }
})
export default router;