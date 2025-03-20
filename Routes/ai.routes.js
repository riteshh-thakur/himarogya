import { Router } from 'express';
import * as aiController from '../Controllers/ai.controller.js';

const airouter = Router();

// Route to handle AI prompt
airouter.post('/get-result',aiController.getResult);

export default airouter;