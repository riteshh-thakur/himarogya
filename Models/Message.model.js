import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,         // Ensures message content is mandatory
        trim: true              // Removes unnecessary spaces
    },
    sender: {
        type: String, // Reference to User model
        ref: 'User',
        required: true
    },
    reciever: {
        type: String, // Reference to User model
        ref: 'User',
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    }
}, {
    timestamps: true            // Automatically manages createdAt and updatedAt
});

// Ensure consistent model naming
const Message = mongoose.model('Message', messageSchema);

export default Message;
