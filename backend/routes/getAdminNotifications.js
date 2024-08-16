import express from 'express';
import notification from "../models/NotificationPanel.js";
import users from "../models/userModel.js";
import { formatDistanceToNow } from 'date-fns';
const router = express.Router();



router.get('/', async (req, res) => {
    const person=req.query.person;
    
    try {

        const existingNotification = await notification.find({ Status: "Unread", for: person });
        
        existingNotification.sort((a, b) => {
            if (new Date(a.Date) > new Date(b.Date)) {
                return -1; 
            }
            if (new Date(a.Date) < new Date(b.Date)) {
                return 1; 
            }
            return 0;
        });
        
        const result = await Promise.all(existingNotification.map(async (notification) => {
            const user = await users.findById(notification.EmpId);
            return {
                EmpName: user.Name,
                Date: formatDistanceToNow(new Date(notification.Date), { addSuffix: true }),
                Reason: notification.Reason
            };
        }));
        
        // console.log(result)
        res.status(200).json({ message: "Successful", result });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
})


export default router;