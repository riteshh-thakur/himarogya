import Message from '../Models/Message.model.js';

// Create and Save a new Message
export const create = async (req, res) => {
    const { content, sender, reciever, chatid } = req.body;

    // Validation for required fields
    if (!content || !sender || !reciever || !chatid) {
        return res.status(422).json({
            success: false,
            message: "All fields (content, sender, reciever, chatid) are required."
        });
    }

    try {
        const message = await Message.create({
            message:content,
            sender:sender,
            reciever:reciever,
            chat:chatid
        })
        res.status(201).json({message:message.message})
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create message.",
            error: err.message
        });
    }
};

// Retrieve and return all messages from the database
export const findAll = async (req, res) => {
    const { chatid } = req.query;

    if (!chatid) {
        return res.status(400).json({
            success: false,
            message: "Chat ID is required to retrieve messages."
        });
    }

    try {
        const messages = await Message.find({ chat: chatid });

        // if (!messages.length) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No messages found for this chat."
        //     });
        // }

        res.status(200).json({
            success: true,
            messages
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error while retrieving messages.",
            error: err.message
        });
    }
};
