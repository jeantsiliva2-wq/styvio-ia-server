import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.send("STYVIO IA server is running!");
});

app.post("/chat", async (req, res) => {
    try {
        const question = req.body.question;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Fanontaniana tsy misy."
            });
        }

        const response = await client.responses.create({
            model: "gpt-6-luna",
            input: question
        });

        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Nisy olana tamin'ny serveur."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`STYVIO IA server running on port ${PORT}`);
});
