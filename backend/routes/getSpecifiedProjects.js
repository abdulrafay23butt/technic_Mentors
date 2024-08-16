import express from 'express';
import project from "../models/projectModel.js";
import userproject from "../models/userproject.js";
import notification from "../models/NotificationPanel.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const id = req.query.id;
    try {
        const projects = await userproject.find({ Userid: id }, { completedProject: 0 });
        if (!projects.length) {
            return res.status(404).json({ message: "No Data Found" });
        }

        const workingProjectIds = projects.map(project => ({
            id: project.workingProject,
            assignedDate: project.AssignedDate
        }));

        const relatedProjects = await project.find({ _id: { $in: workingProjectIds.map(item => item.id) } });
        
        const result = relatedProjects.map(project => {
            const workingProjectInfo = workingProjectIds.find(item => item.id.toString() === project._id.toString());
            return {
                ...project._doc,
                assignedDate: workingProjectInfo ? workingProjectInfo.assignedDate : null
            };
        });
        await notification.updateMany({ for: id, Reason:"Project" }, { $set: { Status: "Read" } });
        res.status(200).json({ message: "Successful",  result });
        
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
});

export default router;
