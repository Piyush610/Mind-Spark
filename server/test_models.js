require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function check(modelName) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`${modelName} is WORKING`);
        return true;
    } catch (error) {
        console.error(`${modelName} FAILED:`, error.message);
        return false;
    }
}

async function listModels() {
    await check("gemini-1.0-pro");
    await check("gemini-2.0-flash-exp");
    await check("gemini-exp-1206");

    // Trying models from user's screenshot
    await check("gemini-2.5-flash");
}

listModels();
