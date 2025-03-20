 
import Doctor from "../models/doctorModel.js";
import user from '../Models/user.js'
import mongoose from "mongoose";
  

const appointment =new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',  
        required: true
      },
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      timeSlot: {
        type: String,
        required: true,
        enum: [
          "9:00 - 9:20", "9:20 - 9:40", "9:40 - 10:00", "10:00 - 10:20",
          "10:20 - 10:40", "10:40 - 11:00", "11:00 - 11:20", "11:20 - 11:40",
          "11:40 - 12:00", "12:00 - 12:20", "12:20 - 12:40", "12:40 - 1:00",
          "2:00 - 2:20", "2:20 - 2:40", "2:40 - 3:00", "3:00 - 3:20",
          "3:20 - 3:40", "3:40 - 4:00", "4:00 - 4:20", "4:20 - 4:40",
          "4:40 - 5:00"
        ]
      },
      status: {
        type: String,
        enum: [ 'confirmed', 'completed', 'cancelled'],
        default: 'confirmed'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
})
const appointmentmodel=mongoose.model('appointment',appointment)
export default appointmentmodel;