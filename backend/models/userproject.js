
import mongoose from 'mongoose';

const UserProjectSchema = mongoose.Schema({
    Userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    workingProject: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Projects'
    },
    completedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects'
    },
    AssignedDate:{
        type: Date,
        default: new Date()
    },
    Type:{
        type: String,
        required: true
    }
})

const UserProject = mongoose.model("UserProject", UserProjectSchema);
export default UserProject;