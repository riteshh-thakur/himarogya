import express from "express";
 import * as chat from '../Controllers/chat.controller.js'
import authMiddleware from "../middleware/authMiddleware.js";
const chatrouter = express.Router();
chatrouter.post("/chat",authMiddleware,chat.createChat);
chatrouter.get('/allchat',authMiddleware,chat.allchats);
chatrouter.get('/docchats',authMiddleware,chat.alldoctorchat)

export default chatrouter;