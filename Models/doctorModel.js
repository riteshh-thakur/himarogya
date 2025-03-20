import mongoose from "mongoose";
const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    licence: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    password:{
      type:String
    },schedule: [
      {
          day: { type: String, required: true },
          time: { type: String, required: true }
      }
  ],
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String }
    }
  ],
  averageRating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;