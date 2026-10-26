    import express from "express";

const app = express();

app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
    res.send("STYVIO IA server is running!");
});

app.post("/chat", async (req, res) => {
    try {
        console.log("CHAT REQUEST RECEIVED:", req.body);

        const question = req.body.question;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Fanontaniana tsy misy."
            });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": GEMINI_API_KEY
                },
                body: JSON.stringify({
                    model: "gemini-3.8-flash",
                    input: `
Ianao dia STYVIO IA, mpanampy IA mahay sy sariaka.

- Valio araka ny fanontanian'ny olona.
- Raha teny Malagasy no ampiasaina, valio amin'ny teny Malagasy.
- Raha français, valio amin'ny français.
- Mahay manampy amin'ny droit, matematika, siansa,
  informatique, programmation ary asa famoronana.
- Hazavao tsikelikely rehefa ilaina.
- Omeo ohatra rehefa manampy amin'ny fahazoana ilay lesona.
- Raha fanontaniana tsotra, valio mivantana.
- Aza mamorona vaovao.

Fanontaniana:
${question}
`
                })
            }
        );

        const data = await response.json();

console.log("GEMINI HTTP STATUS:", response.status);
console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

if (!response.ok) {
    throw new Error(
        `Gemini API HTTP ${response.status}: ${
            data?.error?.message || JSON.stringify(data)
        }`
    );
}


const answer =
    data.output_text ||
    data.steps
        ?.filter(step => step.type === "model_output")
        .flatMap(step => step.content || [])
        .filter(item => item.type === "text")
        .map(item => item.text)
        .join("\n")
        .trim();

res.json({
    answer: answer || "Tsy nahazo valiny avy amin'ny Gemini."
});


    } catch (error) {
        console.error("GEMINI ERROR:", error);

        res.status(500).json({
            error: error.message || "Nisy olana tamin'ny serveur."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`STYVIO IA server running on port ${PORT}`);
});
