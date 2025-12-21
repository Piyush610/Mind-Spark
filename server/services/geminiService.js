const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuestions = async (subjectName, count = 5, level = "beginner") => {
    try {
        console.log("Using Gemini Model: gemini-2.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Generate ${count} multiple-choice questions for the subject "${subjectName}" suitable for a ${level} level student.
    Return ONLY a raw JSON array of objects. Do not use Markdown code blocks. Each object should have:
    - "questionText": string
    - "options": array of 4 strings
    - "correctAnswer": integer (0-3, index of the correct option)
    - "isRemedial": boolean (false)

    Example format:
    [
      {
        "questionText": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "isRemedial": false
      }
    ]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks if the model ignores the instruction
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating questions with Gemini:", error);
        return [];
    }
};

const generateRemedialQuestions = async (subjectName, count = 3) => {
    try {
        console.log("Using Gemini Model (Remedial): gemini-2.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Generate ${count} simple, remedial multiple-choice questions for the subject "${subjectName}" to help a student who is struggling.
    Return ONLY a raw JSON array of objects. Do not use Markdown code blocks. Each object should have:
    - "questionText": string
    - "options": array of 4 strings
    - "correctAnswer": integer (0-3, index of the correct option)
    - "isRemedial": boolean (true)
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating remedial questions with Gemini:", error);
        return [];
    }
};

const getChatResponse = async (history, message) => {
    try {
        console.log("Using Gemini Model (Chat): gemini-2.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error in chat with Gemini:", error);
        return "I'm having trouble connecting right now. Please try again.";
    }
};

module.exports = { generateQuestions, generateRemedialQuestions, getChatResponse };
