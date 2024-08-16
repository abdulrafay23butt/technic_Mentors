import express from 'express';
import project from "../models/projectModel.js";
import userproject from "../models/userproject.js";
import users from "../models/userModel.js";
import mongoose from 'mongoose';
import notifications from "../models/NotificationPanel.js"
const router = express.Router();

router.get("/", async (req, res) => {
    const id = req.query.id;

    try {
        let relatedProjects;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            relatedProjects = await project.find({});
        }
        else {
            const userProjects = await userproject.find({ Userid: id });

            if (userProjects.length === 0) {
                relatedProjects = await project.find({});
            } else {
                const workingProjectIds = userProjects.map(project => project.workingProject);

                relatedProjects = await project.find({ _id: { $nin: workingProjectIds } });
            }
        }
        res.status(200).json({ message: "Successful", relatedProjects });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
});


router.post('/', async (req, res) => {
    const { individualEmpId, selectedProject } = req.body;
    try {
        let newproject = new userproject({ Userid: individualEmpId, workingProject: selectedProject, Type: "individual_projects" });;
        const existing = await userproject.find({ workingProject: selectedProject });

        if (existing && existing.length == 1) {
            const p = await project.findById(selectedProject)
            await users.findByIdAndUpdate(individualEmpId, { $addToSet: { team_Projects: p.name } })
            await users.findByIdAndUpdate(existing[0].Userid, { $addToSet: { team_Projects: p.name } })
            await users.findByIdAndUpdate(existing[0].Userid, { $pull: { individual_projects: p.name } })
        }
        else if (existing && existing.length > 1) {
            const p = await project.findById(selectedProject)
            await users.findByIdAndUpdate(individualEmpId, { $addToSet: { team_Projects: p.name } })
        }
        else if (existing.length == 0) {
            const p = await project.findByIdAndUpdate(selectedProject, { Type: "working" }, { new: true })
            await users.findByIdAndUpdate(individualEmpId, { $addToSet: { individual_projects: p.name } })
        }
        const newNotification=await notifications({EmpId: "66b5b37391540e703803ff04",for:individualEmpId,Reason:"Project"});
        await newNotification.save();
        await newproject.save();
        res.status(200).json({ message: "Successfull" })

    }

    catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})


router.delete('/', async (req, res) => {
    const { data, selectedUsers } = req.body;
    const ids = Object.keys(selectedUsers);
    try {
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No users selected for deletion" });
        }

        const up = await userproject.findOne({ workingProject: data });

        const projectDetails = await project.findById(up.workingProject);

        await users.updateMany(
            { _id: { $in: ids } },
            { $pull: { [up.Type]: projectDetails.name } }
        );

        await userproject.deleteMany({
            workingProject: data,
            Userid: { $in: ids }
        });

        const remainingProject = await userproject.find({ workingProject: data });
        if (remainingProject.length === 0) {
            await project.findByIdAndUpdate(data, { Type: "new" });
        }
        else if (remainingProject.length === 1) {
            const u = await userproject.findByIdAndUpdate(remainingProject[0]._id, { Type: "individual_projects" }, { new: true });
            const p = await project.findById(u.workingProject);
            await users.findByIdAndUpdate(u.Userid, { $addToSet: { individual_projects: p.name } });
            await users.findByIdAndUpdate(u.Userid, { $pull: { team_Projects: p.name } });
        }

        res.status(200).json({ message: "Documents deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while deleting documents" });
    }
});


export default router;