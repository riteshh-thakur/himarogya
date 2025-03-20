import express from 'express'
import Router from 'express'
//import authMiddleware from "../middleware/authMiddleware.js";
import * as message from '../Controllers/message.controller.js'
const messagerouter=Router();
messagerouter.get('/allmessages',message.findAll);
messagerouter.post('/add',message.create);
export default messagerouter;