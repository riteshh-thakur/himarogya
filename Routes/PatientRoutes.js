import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Patient from "../Models/PatientModel.js";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("name age bloodGroup");
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
