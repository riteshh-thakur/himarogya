import * as ai from '../services/ai.service.js';


export const getResult = async (req, res) => {
    try {
        console.log("asd",req.query.da);
        
        const  prompt  = req.query.da;
        console.log("ad",prompt);
        

        const result = await ai.generateResult(prompt);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}