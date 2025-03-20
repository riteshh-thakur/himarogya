import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;
