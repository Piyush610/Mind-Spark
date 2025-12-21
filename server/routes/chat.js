const express = require("express");
const router = express.Router();
const { getChatResponse } = require("../services/geminiService");

router.post("/ask", async (req, res) => {
    try {
        const { history, message } = req.body;
        const response = await getChatResponse(history, message);
        res.json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get chat response" });
    }
});

module.exports = router;
