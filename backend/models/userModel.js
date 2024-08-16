
import mongoose from 'mongoose';

const userSchema=mongoose.Schema({
    Name:{
        type: String,
        required: true,
    },
    Email:{
        type: String,
        required: true,
    },
    Password:{
        type: String,
        required: true,
    },
    Status:{
        type: String,
        default: "Member"
    },
    team_Projects:{
        type: [String],
    },
    individual_projects:{
        type: [String],
    }
    
})

const User=mongoose.model("User",userSchema);
export default User;