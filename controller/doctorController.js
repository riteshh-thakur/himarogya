import Doctor from "../models/doctorModel.js";
import jwt from 'jsonwebtoken';
/**
 * Get all doctors
 */
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
export const addschedule = async (req, res) => {
  try {
      const { doctorname, schedule } = req.body;

      // Validate the schedule format (Optional but recommended)
      if (!Array.isArray(schedule) || schedule.length === 0) {
          return res.status(400).json({ error: "Invalid schedule format. It should be a non-empty array." });
      }

      // Find doctor by name
      const doctor = await Doctor.findOne({ name: doctorname });

      if (!doctor) {
          return res.status(404).json({ error: "Doctor not registered" });
      }

      // Merge the new schedule with the existing one
      const updatedSchedule = [...(doctor.schedule || []), ...schedule];

      // Update the doctor with the merged schedule
      const updatedDoctor = await Doctor.findByIdAndUpdate(
          doctor._id,
          { schedule: updatedSchedule },
          { new: true, runValidators: true }
      );

      return res.status(200).json({ doctor: updatedDoctor });
  } catch (error) {
      console.error("Add schedule error:", error); 
      res.status(500).json({ error: "Error in adding schedule", details: error.message });
  }
};
export const deleteDoctorSchedule = async (req, res) => {
  const { doctorId } = req.body;

  if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID is required." });
  }

  try {
      const updatedDoctor = await Doctor.findByIdAndUpdate(
          doctorId,
          { $set: { schedule: [] } }, // Clear the schedule array
          { new: true }
      );

      if (!updatedDoctor) {
          return res.status(404).json({ error: "Doctor not found." });
      }

      return res.status(200).json({ success: true, message: "Schedule deleted successfully", doctor: updatedDoctor });
  } catch (error) {
      console.error("Delete schedule error:", error);
      return res.status(500).json({ error: "Error deleting schedule", details: error.message });
  }
};

export const login = async (req, res) => {
  try {
      const { doctorname } = req.body;   
      const doctor = await Doctor.findOne({ name: doctorname });   

      if (!doctor) {
          return res.status(400).json({ error: "Doctor not registered" });   
      }

      const token = jwt.sign(
          { name: doctor.name, _id: doctor._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
      );
        

      res.status(200).json({ message: "Login successful",
        success: true,
        token,doctor });
  } catch (error) {
      console.error("Login Error:", error);  // Logs the error for debugging
      res.status(500).json({ error: "Error in doclogin", details: error.message });  // Correct JSON format
  }
}


/**
 * Get doctor by ID
 */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};




// ✅ Add Doctor Controller
export const addDoctor = async (req, res) => {
  try {
      console.log("🔹 Received Data from Frontend:", req.body); // ✅ Debugging

      const { name, experience, licence, specialization } = req.body;

      // ✅ Check if all required fields are present
      if (!name || !experience || !licence || !specialization) {
          return res.status(400).json({ success: false, message: "All fields are required" });
      }

      // ✅ Ensure correct data types (optional)
      // if (typeof experience !== "number") {
      //     return res.status(400).json({ success: false, message: "Experience must be a number" });
      // }

      const newDoctor = new Doctor({ name, experience, licence, specialization });
      await newDoctor.save();

      console.log("✅ Doctor added successfully:", newDoctor); // ✅ Debugging log
      res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor });
  } catch (error) {
      console.error("❌ Error in Backend:", error); // ✅ Debugging log
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/**
 * Update doctor details
 */
export const updateDoctor = async (req, res) => {
  try {
    const { name, experience, licence, specialization } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, experience, licence, specialization },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, data: doctor, message: "Doctor updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

/**
 * Delete a doctor
 */
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};




// DELETE a doctor by ID
// const deleteDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if the doctor exists
//     const doctor = await Doctor.findById(id);
//     if (!doctor) {
//       return res.status(404).json({ success: false, message: "Doctor not found" });
//     }

//     // Delete the doctor
//     await Doctor.findByIdAndDelete(id);
//     res.status(200).json({ success: true, message: "Doctor deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting doctor:", error);
//     res.status(500).json({ success: false, message: "Server error", error });
//   }
// };

// module.exports = { deleteDoctor };

export const giverating=async(req,res)=>{
  const { rating, comment } = req.body;
  const doctorName = req.params.name;
  const { id: userId } = req.user;
  try {
    console.log("sah",doctorName);
    
    const doctor = await Doctor.findOne({name:doctorName});
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
console.log("sa",doctor);

    doctor.ratings.push({ userId: userId, rating, comment });

    // Calculate average rating
    const totalRatings = doctor.ratings.length;
    const averageRating = doctor.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
    doctor.averageRating = averageRating.toFixed(1);

    await doctor.save();
    res.json({ message: 'Rating added successfully', doctor });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
export const getrating=async(req,res)=>{
  try {
    const doctor = await Doctor.findById(req.params.id).populate('ratings.userId', 'name');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }

}


