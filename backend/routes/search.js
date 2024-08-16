import express from 'express';
import project from "../models/projectModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { category, fromDate, toDate } = req.body;
    let query = {};

    if (category) {
        query.Type = category;
    }
    if (fromDate) {
        query.FromDate = { $gte: new Date(fromDate) };
    }
    if (toDate) {
        query.ToDate = { $lte: new Date(toDate) };
    }

    try {
        const projects = await project.find(query);
        res.status(200).json({ message: "Successful", data: projects });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Unsuccessful" });
    }
});

export default router;
