import { GoogleGenerativeAI } from "@google/generative-ai";
import Doctor from "../models/doctorModel.js";

const key = "AIzaSyAowgJOXblYyZidVx1YDeAYLdwvyuiqz8Q";
const genAI = new GoogleGenerativeAI(key);
const date = new Date();
const options = { weekday: "long" };
const day = date.toLocaleDateString("en-US", options);

const fetchDoctors = async () => {
    const doctors = await Doctor.find();
    return doctors;
};

export const generateResult = async (prompt) => {
    console.log(process.env.GOOGLE_AI_KEY, "key");

    const doctors = await fetchDoctors();
    console.log("Fetched Doctors Data:", doctors);

    // Prepare doctor data for the prompt
    const formattedDoctors = doctors.map((doctor) => {
        const todaysSchedule = doctor.schedule.find(schedule => schedule.day === day);
        return {
          id:doctor._id,
            name: doctor.name,
            specialty: doctor.specialization,
            experience: doctor.experience,
            available: !!todaysSchedule, // Check if available
        };
    });
    console.log("s",formattedDoctors);
    

    const systemInstruction = `
        You are a doctor assigner. You suggest a doctor based on the user's symptoms,
        the doctor's specialty, and the doctor's availability for today. If someone asks in Hindi, give the result in Hindi.
        
        Today is: ${day}
        
        Doctor data: ${JSON.stringify(formattedDoctors)}
        
        Process:
        1. Check the user's symptoms and match them with a doctor's specialty.
        2. Verify if the doctor is available today (check the 'available' field).
        3. If a doctor matches the specialty and is available, provide their details.
        4. If no doctor is available or matches the specialty, inform the user.
        5. generate response in hindi language in devnagri lipi if prompt is in hindi  
        
        Response format:
        {
            "doctor": {
            "id":"doctor._id"
                "name": "Doctor's Name",
                "specialty": "Doctor's Specialty",
                "experience": "Doctor's Experience",
                "available": true/false
            },
            "message": "A helpful message to the user."
        }
        
        Example:
        
        User: I have chest pain.
        Response:
        {
            "doctor": {
            "id":"doctor._id"
                "name": "Dr. Smith",
                "specialty": "Cardiology",
                "experience": "10 years",
                "available": true
            },
            "message": "Dr. Smith, a cardiologist, is available today."
        }
    `;

    const updatedModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
        },
        systemInstruction,
    });

    try {
        const result = await updatedModel.generateContent(prompt);
        const responseText = result.response.text();
        const parsedResponse = JSON.parse(responseText);

        if (parsedResponse.doctor && !parsedResponse.doctor.available) {
            return JSON.stringify({ message: "No doctors are available at this time regarding your disease.please provide more info about your disease so i can help you finding a doctor" });
        }

        return responseText;
    } catch (error) {
        console.error("Error generating result:", error);
        return JSON.stringify({ message: "An error occurred while processing your request." });
    }
};
