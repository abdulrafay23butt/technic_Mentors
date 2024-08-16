
import mongoose from 'mongoose';

const TodoSchema = mongoose.Schema({
    Userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    Name: {
        type: String,
        required: true,
    },
    Description:{
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        default: new Date()
    },
    Status:{
        type: String,
        default :"unChecked"
    }
})

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;