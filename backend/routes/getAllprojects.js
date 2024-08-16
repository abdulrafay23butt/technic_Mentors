import express from 'express';
import project from "../models/projectModel.js";
import userproject from "../models/userproject.js";
const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const projects = await project.find({});
        if (!projects) {
            return res.status(404).json({ message: "No Data Found" })
        }
        res.status(200).json({ message: "Successful", projects });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

router.put('/', async (req, res) => {
    const { selectedProject } = req.body;
    // console.log(selectedProject)
    try {
        await project.findByIdAndUpdate(selectedProject.id, { name: selectedProject.name, Client: selectedProject.client, FromDate: selectedProject.from, ToDate: selectedProject.to, Type: selectedProject.type })
        res.status(200).json({ message: "Successful"});
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

export default router;