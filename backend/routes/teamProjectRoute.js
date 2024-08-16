import express from 'express';
import project from "../models/projectModel.js";
import userproject from "../models/userproject.js";
import users from "../models/userModel.js";
import notifications from "../models/NotificationPanel.js"
import mongoose from 'mongoose';
const router = express.Router();

router.get('/', async (req, res) => {
    let ids = [req.query.id1, req.query.id2, req.query.id3, req.query.id4];

    ids = ids.filter(id => id && mongoose.Types.ObjectId.isValid(id));

    try {
        const userProjects = await userproject.find({ Userid: { $in: ids } }, { completedProject: 0 });

        const workingProjectIds = userProjects.map(project => project.workingProject);
        const relatedProjects = await project.find({ _id: { $nin: workingProjectIds } });

        res.status(200).json({ message: 'Successful', relatedProjects });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Unsuccessful', error: err.message });
    }
});



router.post('/', async (req, res) => {
    const { selectedOptions, selectedProject } = req.body;
    const selectOptionsArray = [selectedOptions.select1, selectedOptions.select2, selectedOptions.select3, selectedOptions.select4];

    try {
        const selectedProj = await project.findByIdAndUpdate(selectedProject,{Type:"working"},{ new: true });
        if (!selectedProj) {
            return res.status(404).json({ message: 'Selected project not found' });
        }

       

        for (const option of selectOptionsArray) {
            if (option && option.trim() !== '') {
                const newProject = new userproject({
                    Userid: option,
                    workingProject: selectedProject,
                    Type: "team_Projects"
                });
                const newNotification=await notifications({EmpId: "66b5b37391540e703803ff04",for:option,Reason:"Project"})
                await newProject.save();
                await newNotification.save();

                await users.findByIdAndUpdate(option, { $addToSet: { team_Projects: selectedProj.name } });
            }
        }
        res.status(200).json({ message: "Successful" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})
export default router;