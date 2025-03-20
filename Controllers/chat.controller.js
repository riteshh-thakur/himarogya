



import Chat from "../Models/Chat.model.js";
import Doctor from "../models/doctorModel.js";
import UserModel from "../Models/user.js";


// Create a new chat
export const createChat = async (req, res) => {
    try {
        const { id: userId } = req.user; // Extract user ID from req.user
        const { doctor: doctorName } = req.query; // Doctor's name from query

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const doctor = await Doctor.findOne({ name: doctorName });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found", success: false });
        }

        // Check for existing chat
        const existingChat = await Chat.findOne({
            $or: [
                { userone: user._id, usertwo: doctor._id },
                { userone: doctor._id, usertwo: user._id }
            ]
        });

        if (existingChat) {
            return res.status(200).json({ chatId: existingChat._id, success: true });
        }

        const newChat = await Chat.create({
            userone: user._id,
            usertwo: doctor._id
        });

        return res.status(201).json({ chatId: newChat._id, success: true });
    } catch (error) {
        console.error("Chat Creation Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false
        });
    }
};

// Fetch all chats for a user
export const allchats = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const userExists = await UserModel.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Fetch chats involving the user
        const chats = await Chat.find({
            $or: [{ userone: userId }, { usertwo: userId }]
        }).populate("usertwo");   

        return res.status(200).json({ chats, success: true });
    } catch (error) {
        console.error("Fetch Chats Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false
        });
    }
};






// Fetch all chats for a doctor
export const alldoctorchat = async (req, res) => {
    try {
        const { _id: doctorId } = req.user;
        const doctorExists = await Doctor.findById(doctorId);

        if (!doctorExists) {
            return res.status(404).json({ message: "Doctor not found", success: false });
        }

        const chats = await Chat.find({
            $or: [{ userone: doctorId }, { usertwo: doctorId }]
        }).populate("userone");   

        return res.status(200).json({ chats, success: true });
    } catch (error) {
        console.error("Fetch Chats Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false
        });
    }
};
