import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import newProjects from "./routes/newProjectRoute.js";
import workingProjects from "./routes/workingProjectRoute.js";
import user from "./routes/userRoute.js"
import allprojects from "./routes/getAllprojects.js";
import userprojects from "./routes/getuserproject.js";
import team from "./routes/teamProjectRoute.js"
import completedProjects from "./routes/getCompletedProjects.js"
import search from "./routes/search.js"
import login from './routes/Login.js';
import signup from './routes/signup.js';
import leaves from './routes/LeaveRoute.js';
import adminPendingLeaves from './routes/adminPendingLeaves.js';
import adminAccRejLeaves from './routes/adminAccRejLeaves.js';
import getproject from './routes/getSpecifiedProjects.js'
import todo from './routes/todo.js'
import notification from './routes/getAdminNotifications.js';
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/technicMentors")
    .then(() => {
        console.log("db connected");
    })

app.use("/NewProject",newProjects);
app.use("/WorkingProject",workingProjects);
app.use("/users",user);
app.use("/AllProject",allprojects);
app.use("/UserProject",userprojects);
app.use("/TeamProject",team);
app.use("/CompleteProject",completedProjects);
app.use("/search",search);
app.use('/signup',signup);
app.use('/login',login);
app.use('/leave',leaves);
app.use('/adminPendingleave',adminPendingLeaves)
app.use('/adminAccRejleave',adminAccRejLeaves)
app.use('/getprojects',getproject)
app.use('/Todo',todo)
app.use('/getNotification',notification)
app.listen(3000, () => {
    console.log("server connected")
})