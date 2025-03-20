import * as appointment from '../Controllers/appintment.controller.js'
import authMiddleware from "../middleware/authMiddleware.js";
import { Router } from 'express';
const appointmentrouter = Router();
appointmentrouter.post('/create',authMiddleware,appointment.createAppointment);
appointmentrouter.get('/appointment',authMiddleware,appointment.getAppointmentById);
appointmentrouter.get('/allapp',appointment.getAllAppointments);
appointmentrouter.get('/slots',appointment.getSlots);
appointmentrouter.get('/getdocapp',authMiddleware,appointment.getdoctorappointments)
appointmentrouter.get('/patapp',authMiddleware,appointment.getpatientappointments);
appointmentrouter.get('/update',appointment.updateAppointmentStatus)
export default appointmentrouter;