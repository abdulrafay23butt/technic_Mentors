import mongoose from 'mongoose';

const projectSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    Client:{
        type: String,
        required: true,
    },
    FromDate:{
        type: Date,
        required: true,
    },
    ToDate:{
        type: Date,
        required: true,
    },
    Type:{
        type: String,
        required: true,
    }
})

const project=mongoose.model("Projects",projectSchema);
export default project;