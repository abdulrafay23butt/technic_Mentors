import mongoose from 'mongoose';

const leaveSchema=mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    Name:{
        type: String,
        required: true,
    },
    Description:{
        type: String,
        required: true,
    },
    From:{
        type: Date,
        required: true,
    },
    To:{
        type: Date,
        required: true,
    },
    Status:{
        type: String,
        required: true,
    }
})

const project=mongoose.model("Leaves",leaveSchema);
export default project;