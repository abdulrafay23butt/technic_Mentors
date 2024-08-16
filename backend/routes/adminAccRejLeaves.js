import express from 'express';
import leaves from "../models/LeaveModel.js";
import notification from "../models/NotificationPanel.js";

import users from "../models/userModel.js";
const router = express.Router();



router.get('/', async (req, res) => {
    try {

        const existingLeave = await leaves.find({ Status: { $ne: "Pending" } });

        if (!existingLeave) {
            return res.status(404).json({ message: "No Leave Exists" });
        }

        res.status(200).json({ message: "Successful", existingLeave });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
})


router.put('/', async (req, res) => {
    const { id, Status } = req.body;
    try {
        const leave = await leaves.findByIdAndUpdate(id, { Status });
        const user = await users.findOne({ Name: "admin" });
        const newNotification = new notification({ EmpId: user._id, for: leave.id, Reason: "Leave" })
        await newNotification.save();
        res.status(200).json({ message: "Success" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Fail" });
    }
})
export default router;