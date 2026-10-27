import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("STYVIO MUSIC server is running!");
});

// Test endpoint
app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "STYVIO MUSIC serveur fonctionne."
    });
});

// Music generation endpoint
app.post("/generate", async (req, res) => {
    try {

        console.log("MUSIC REQUEST:", req.body);

        const title = req.body.title;
        const lyrics = req.body.lyrics;
        const style = req.body.style;

        if (!title || !title.trim()) {
            return res.status(400).json({
                error: "Titre tsy misy."
            });
        }

        if (!lyrics || !lyrics.trim()) {
            return res.status(400).json({
                error: "Paroles na description tsy misy."
            });
        }

        if (!style || !style.trim()) {
            return res.status(400).json({
                error: "Style musical tsy misy."
            });
        }

        console.log("TITLE:", title);
        console.log("STYLE:", style);
        console.log("LYRICS:", lyrics);

        /*
         * Eto no hampifandraisina amin'ny
         * AI Music Generator rehefa voafidy
         * ny service gratuit mety.
         */

        return res.json({
            success: true,
            message: "Configuration reçue.",
            title: title,
            style: style,
            audioUrl: null
        });

    } catch (error) {

        console.error("MUSIC SERVER ERROR:", error);

        return res.status(500).json({
            error: error.message ||
                "Nisy olana tamin'ny serveur."
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `STYVIO MUSIC server running on port ${PORT}`
    );
});              
