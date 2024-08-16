import express from 'express';
import leaves from "../models/LeaveModel.js";
import notification from "../models/NotificationPanel.js";
const router = express.Router();

router.post("/", async (req, res) => {
    const { id, Name, Description, From, To, Status } = req.body;
    const fromDate = new Date(From);
    const toDate = new Date(To);
    try {
        const lastLeave = await leaves.findOne({ id }).sort({ From: -1 });

        if (lastLeave && fromDate <= lastLeave.To) {
            console.log("hello");
            return res.status(404).json({ message: "Leave Start Date Must Be Greater Than Last Leave's Start Date" });
        }

        const newLeave = new leaves({ id, Name, Description, From: fromDate, To: toDate, Status });
        await newLeave.save();
        res.status(200).json({ message: "Successful" });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }

})

router.get('/', async (req, res) => {
    try {

        const existingLeave = await leaves.find({});

        if (!existingLeave) {
            return res.status(404).json({ message: "No Leave Exists" });
        }
        existingLeave.sort((a, b) => {
            if (a.Status === 'Pending' && b.Status !== 'Pending') {
                return -1;
            }
            if (a.Status !== 'Pending' && b.Status === 'Pending') {
                return 1;
            }
            if (new Date(a.From) > new Date(b.From)) {
                return -1; 
            }
            if (new Date(a.From) < new Date(b.From)) {
                return 1;
            }

            return 0;
        });
        await notification.updateMany({ for: "Admin" }, { $set: { Status: "Read" } });
        res.status(200).json({ message: "Successful", existingLeave });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
})

router.delete('/', async (req, res) => {
    const { id } = req.body;
    console.log(id);
    try {
        await leaves.findByIdAndDelete(id);
        res.status(200).json({ message: "Success" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Fail" });
    }
})

router.put('/', async (req, res) => {
    const { _id, Name, Description, From, To } = req.body;
    try {
        await leaves.findByIdAndUpdate(_id, { Name, Description, From, To });
        res.status(200).json({ message: "Success" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ message: "Fail" });
    }
})
export default router;