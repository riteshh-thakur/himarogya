import express from 'express';
const app=express();
import airouter from './Routes/ai.routes.js';
 
import cors from 'cors';
import AuthRouter from './Routes/AuthRouter.js';
import doctorRoutes from "../backend/routes/mainRoutes.js";
 import chatrouter from './Routes/chat.routes.js';
 import messagerouter from './Routes/message.routes.js';
 import authRoutes from "./Routes/authRoutes.js";
import './Models/db.js';

const PORT = process.env.PORT || 8080;

app.get('/ping',(req,res)=>{
    res.send('Pong');
})

 
app.use(cors());
app.use(express.json());
app.use("/api", doctorRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/patient", patientRoutes);

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
      // Ensure you have `req.user.id` from authentication middleware
      const patient = await Patient.findById(req.user.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });

      res.json({
          name: patient.name,
          age: patient.age,
          bloodGroup: patient.bloodGroup,
      });
  } catch (error) {
      console.error("Error fetching patient profile:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
 
app.use('/ai',airouter)
 
app.use('/chat',chatrouter)
app.use('/message',messagerouter)
app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`);
})
 