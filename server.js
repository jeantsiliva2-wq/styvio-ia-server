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
    try {console.log("CHAT REQUEST RECEIVED:", req.body);
        const question = req.body.question;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Fanontaniana tsy misy."
            });
        }

        
const response = await client.responses.create({
    model: "gpt-6-luna",

    instructions: `
Ianao dia STYVIO IA, mpanampy IA mahay sy sariaka.

- Valio araka ny tena fanontanian'ny olona.
- Raha teny Malagasy no ampiasainy, valio amin'ny teny Malagasy.
- Raha teny français no ampiasainy, valio amin'ny français.
- Mahay manazava lesona, manampy amin'ny droit, matematika,
  siansa, informatique, programmation ary asa famoronana.
- Raha mangataka fanazavana ny olona, hazavao tsikelikely
  amin'ny teny mora azo ary omeo ohatra.
- Raha fanontaniana tsotra, valio mivantana.
- Raha misy zavatra tsy azonao antoka, lazao am-pahatsorana.
- Aza mamorona vaovao na milaza fa nanao zavatra tsy nataonao.
- Miresaha am-pitiavana sy am-panajana, toy ny mpanampy
  vonona hanampy amin'ny resaka mitohy.
`,

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
