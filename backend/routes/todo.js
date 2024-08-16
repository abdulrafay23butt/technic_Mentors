import express from 'express';
import todo from "../models/TodoModel.js";
import userproject from "../models/userproject.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const id = req.query.id;
    try {
        const result = await todo.find({ Userid: id })
        res.status(200).json({ message: "Successful", result });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
});

router.post('/', async (req, res) => {
    const { formdata, user } = req.body;
    try {
        const new_todo = new todo({ Userid: user, Name: formdata.Name, Description: formdata.Description });
        await new_todo.save();
        res.status(200).json({ message: "Successful" });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
})

router.put("/", async (req, res) => {

    const id = req.query.id;
    const { formdata } = req.body;
    try {
        await todo.findByIdAndUpdate(id, { Name: formdata.Name, Description: formdata.Description, Status: formdata.Status })
        res.status(200).json({ message: "Successful" });

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
});

router.delete('/', async (req, res) => {
    const { id } = req.body;
    try {
        await todo.findByIdAndDelete(id);
        res.status(200).json({ message: "Successful" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
})
export default router;
