import express from 'express';
import project from "../models/projectModel.js"
import userProject from "../models/userproject.js"
import users from "../models/userModel.js";
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, client, from, to, type } = req.body;
        const newProject = new project({ name: name, Client: client, FromDate: from, ToDate: to, Type: type })
        await newProject.save();
        res.status(200).json({ message: "Successfull" })
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

router.get("/", async (req, res) => {
    try {
        const projects = await project.find({ Type: "new" });
        if (!projects) {
            return res.status(404).json({ message: "No Data Found" })
        }
        res.status(200).json({ message: "Successful", projects });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

router.delete('/', async (req, res) => {
    const { id } = req.body;
    try {
        const p = await project.findByIdAndDelete(id);

        const up = await userProject.deleteMany({ workingProject: id });

        await users.updateMany(
            { $pull: { [up.Type]: p.name } } 
        );

        res.status(200).json({ message: "Successfully Deleted" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
});

export default router;