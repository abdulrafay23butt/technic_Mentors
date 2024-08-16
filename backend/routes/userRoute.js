import express from 'express';
import User from "../models/userModel.js"
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { Name, team_Projects, individual_projects } = req.body;
        // console.log(type);
        const newUser = new User({ Name, team_Projects, individual_projects })
        await newUser.save();
        res.status(200).json({ message: "Successfull" })
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "UnSuccessfull" })
    }
})

router.get('/', async (req, res) => {
    try {
        const users = await User.find({ Status: { $ne: "Admin" }});
res.status(200).json(users);
    }catch (err) {
    console.log(err);
    res.status(400).json({ message: "UnSuccessfull" })
}
})
export default router