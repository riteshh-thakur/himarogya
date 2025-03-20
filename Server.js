



// import dotenv from "dotenv";
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import multer from "multer";
// import fs from "fs";
// import jwt from "jsonwebtoken";
// import doctorRoutes from "./routes/mainRoutes.js";
// import authRoutes from "./Routes/authRoutes.js";
// import authMiddleware from "./middleware/authMiddleware.js";
// import connectDB from "./Models/db.js";
// import airouter from './Routes/ai.routes.js';
// import chatrouter from "./Routes/chat.routes.js";
// import chat from "./Models/Chat.model.js";
// import messagerouter from "./Routes/message.routes.js";

// dotenv.config();

// // Initialize Express and HTTP server
// const app = express();
// const server = createServer(app);
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to MongoDB
// connectDB();

// // Initialize Socket.io with CORS enabled
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// // Authenticate users for WebSocket connections
// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
//     const chatId = socket.handshake.query.chatid;

//     if (!mongoose.Types.ObjectId.isValid(chatId)) {
//       return next(new Error("Invalid chatId"));
//     }

//     socket.chat = await chat.findById(chatId);

//     if (!token) {
//       return next(new Error("Authentication error"));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return next(new Error("Authentication error"));
//     }

//     socket.user = decoded;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// // WebSocket Events
// const rooms = {}; // Store active rooms





// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join-room", (chatId) => {
//       socket.join(chatId);
//       console.log(`User joined room: ${chatId}`);
//   });

//   socket.on("project-message", (data) => {
//       io.to(data.chatId).emit("project-message", data);
//   });

//   socket.on("send-image", ({ chatId, image, sender }) => {
//       console.log("Image received on server:", image);  // Debugging log
//       io.to(chatId).emit("receive-image", { image, sender });
//   });

//   socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//   });
// });


 

// // Multer setup for file uploads
// const upload = multer({ dest: "uploads/" });

// // REST API for image uploads
// app.post("/upload", upload.single("image"), (req, res) => {
//   const { roomId } = req.body;
//   const filePath = req.file.path;
//   const fileData = fs.readFileSync(filePath);
//   const base64Image = fileData.toString("base64");

//   io.to(roomId).emit("receiveImage", { image: base64Image });

//   res.json({ message: "File uploaded and sent!" });
// });

// // API Routes
// app.use("/api", doctorRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/chat", chatrouter);
// app.use("/ai", airouter);
// app.use("/message", messagerouter);

// // Global Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

// // Start the server
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });




// import express from "express";
// import mongoose from "mongoose";
// import multer from "multer";
// import cors from "cors";
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import Prescription from "./models/Prescription.js";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads")); // Serve uploaded files statically

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/doctor-patient", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Multer storage setup
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const upload = multer({ storage });

// // Upload prescription endpoint
// app.post("/upload-prescription", upload.single("prescription"), async (req, res) => {
//   try {
//     const { chatId } = req.body;
//     if (!chatId) return res.status(400).json({ error: "chatId is required" });

//     const newPrescription = new Prescription({
//       chatId,
//       fileUrl: `/uploads/${req.file.filename}`,
//       uploadedAt: new Date(),
//     });

//     await newPrescription.save();
//     res.status(201).json({ message: "Prescription uploaded successfully!", fileUrl: newPrescription.fileUrl });
//   } catch (error) {
//     res.status(500).json({ error: "Error uploading prescription" });
//   }
// });

// // Fetch prescriptions for a patient
// app.get("/prescriptions/:chatId", async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({ chatId: req.params.chatId });
//     res.json(prescriptions);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching prescriptions" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";
import doctorRoutes from "./routes/mainRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import connectDB from "./Models/db.js";
import airouter from "./Routes/ai.routes.js";
import chatrouter from "./Routes/chat.routes.js";
import chat from "./Models/Chat.model.js";
import messagerouter from "./Routes/message.routes.js";
import Prescription from "./Models/Prescription.js";

 import appointmentrouter from "./Routes/appointment.route.js";
import jwt from "jsonwebtoken";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // Serve uploaded files statically

// Connect to MongoDB
connectDB();

// Initialize Socket.io with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Authenticate users for WebSocket connections
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1];
    const chatId = socket.handshake.query.chatid;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return next(new Error("Invalid chatId"));
    }

    socket.chat = await chat.findById(chatId);

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

// WebSocket Events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (chatId) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  socket.on("project-message", (data) => {
    io.to(data.chatId).emit("project-message", data);
  });

  socket.on("send-image", ({ chatId, image, sender }) => {
    console.log("Image received on server:", image);
    io.to(chatId).emit("receive-image", { image, sender });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Multer storage setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload prescription endpoint
app.post("/upload-prescription", upload.single("prescription"), async (req, res) => {
  try {
    const { chatId } = req.body;
    if (!chatId) return res.status(400).json({ error: "chatId is required" });

    const newPrescription = new Prescription({
      chatId,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedAt: new Date(),
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription uploaded successfully!", fileUrl: newPrescription.fileUrl });
  } catch (error) {
    res.status(500).json({ error: "Error uploading prescription" });
  }
});

// Fetch prescriptions for a patient
app.get("/prescriptions/:chatId", async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ chatId: req.params.chatId });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching prescriptions" });
  }
});

// API Routes
app.use("/api", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/chat", chatrouter);
app.use("/ai", airouter);
app.use("/message", messagerouter);
app.use('/chat', chatrouter);
app.use('/ai', airouter);
app.use('/message',messagerouter);
app.use('/appointment',appointmentrouter);
const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
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
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
