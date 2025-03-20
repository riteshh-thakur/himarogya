import Appointment from '../Models/Appointment.model.js'

// ➤ Create a New Appointment
export const createAppointment = async (req, res) => {
    console.log("hello");
    
    const patientId =req.user.id;
    const {doctorId}=req.query;
    const { date, timeSlot } = req.body;
console.log(patientId,doctorId,date,timeSlot);

    if (!doctorId || !patientId || !date || !timeSlot) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    
    try {
        const newAppointment = new Appointment({
            doctorId,
            patientId,
            date,
            timeSlot,
            status: 'confirmed'
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment created successfully", newAppointment });
    } catch (error) {
        res.status(500).json({ error: "Error creating appointment", details: error.message });
    }
};

// ➤ Get All Appointments
export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctorId').populate('patientId');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Error fetching appointments", details: error.message });
    }
};

// ➤ Get Appointment by ID
export const getAppointmentById = async (req, res) => {
    const  id  = req.params;

    try {
        const appointment = await Appointment.findById(id).populate('doctorId').populate('patientId');
        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: "Error fetching appointment", details: error.message });
    }
};

// ➤ Update Appointment Status
export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.query;
    const { status } = req.query;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.json({ message: "Status updated successfully", updatedAppointment });
    } catch (error) {
        res.status(500).json({ error: "Error updating appointment", details: error.message });
    }
};

// ➤ Delete Appointment
export const deleteAppointment = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting appointment", details: error.message });
    }
};
export const getSlots = async (req, res) => {
    const { doctorId, date } = req.query;

    // Check if doctorId and date are provided
    if (!doctorId || !date) {
        return res.status(400).json({ error: "Doctor ID and Date are required" });
    }

    const allSlots = [
        "9:00 - 9:20", "9:20 - 9:40", "9:40 - 10:00", "10:00 - 10:20",
        "10:20 - 10:40", "10:40 - 11:00", "11:00 - 11:20", "11:20 - 11:40",
        "11:40 - 12:00", "12:00 - 12:20", "12:20 - 12:40", "12:40 - 1:00",
        "2:00 - 2:20", "2:20 - 2:40", "2:40 - 3:00", "3:00 - 3:20",
        "3:20 - 3:40", "3:40 - 4:00", "4:00 - 4:20", "4:20 - 4:40",
        "4:40 - 5:00"
    ];

    try {
        const bookedAppointments = await Appointment.find({
            doctorId,
            date: new Date(date), // Ensure date format is correct
            status: { $in: ["confirmed", "pending"] }
        });

        const bookedSlots = bookedAppointments.map(appointment => appointment.timeSlot);

        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

        res.status(200).json({
            doctorId,
            date,
            bookedSlots,
            availableSlots
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching slots", details: error.message });
    }
};
export const getdoctorappointments=async(req,res)=>{
    const id=req.user._id;
    const appintments=await Appointment.find({doctorId:id}).populate('patientId');
    res.status(201).json(appintments)
}
export const getpatientappointments=async(req,res)=>{
    const id=req.user.id;
    const appintments=await Appointment.find({patientId:id}).populate('doctorId');
    res.status(201).json(appintments)
}