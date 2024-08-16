import express from 'express';
import leaves from "../models/LeaveModel.js";
import notification from "../models/NotificationPanel.js";
const router = express.Router();

router.post("/", async (req, res) => {
    const { id, Name, Description, From, To, Status } = req.body;
    const fromDate = new Date(From);
    const toDate = new Date(To);
    try {
        const lastLeave = await leaves.find({ id }).sort({ From: -1 });

        const isDateValid = lastLeave.every(leave => {
            const leaveFrom = new Date(leave.From);
            const leaveTo = new Date(leave.To);
            return fromDate > leaveFrom && fromDate < leaveTo;
        });
    
        if (!isDateValid) {
            return res.status(404).json({ message: "Leave Start Date Must Be Greater Than All Existing Leave Start Dates and Less Than All Existing Leave End Dates" });
        }

        const newLeave = new leaves({ id, Name, Description, From: fromDate, To: toDate, Status });
        const newNotification = new notification({ EmpId: id, for: "Admin" })
        await newLeave.save();
        await newNotification.save();
        res.status(200).json({ message: "Successful" });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }

})

router.get('/', async (req, res) => {
    const id = req.query.id;
    try {

        const existingLeave = await leaves.find({ id });

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
        await notification.updateMany({ for: id, Reason:"Leave" }, { $set: { Status: "Read" } });
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