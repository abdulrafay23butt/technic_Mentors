import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
    EmpId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    for: {
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    Status: {
        type: String,
        default: "Unread",
    },
    Reason: {
        type: String,
        default: "none"
    }
})

const notification = mongoose.model("Notifications", notificationSchema);
export default notification;