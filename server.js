import express from "express";

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.MUSICAPI_API_KEY;
const API_BASE = "https://api.musicapi.ai/api/v1/sonic";

app.get("/", (req, res) => {
    res.send("STYVIO MUSIC server is running!");
});

app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "STYVIO MUSIC server fonctionne.",
        musicApiConfigured: Boolean(API_KEY)
    });
});

// Manomboka mamorona hira
app.post("/generate", async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({
                success: false,
                error: "MUSICAPI_API_KEY tsy voapetraka ao amin'ny serveur."
            });
        }

        const title = req.body.title?.trim();
        const lyrics = req.body.lyrics?.trim();
        const style = req.body.style?.trim();

        if (!title || !lyrics || !style) {
            return res.status(400).json({
                success: false,
                error: "Ilaina ny title, lyrics ary style."
            });
        }

        console.log("MUSIC REQUEST:", { title, style });

        const response = await fetch(
            `${API_BASE}/create`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task_type: "create_music",
                    custom_mode: true,
                    mv: "sonic-v6",
                    title: title.slice(0, 80),
                    tags: style.slice(0, 1000),
                    prompt: lyrics.slice(0, 5000)
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.task_id) {
            console.error("MUSICAPI CREATE ERROR:", result);

            return res.status(502).json({
                success: false,
                error: result.error ||
                    result.message ||
                    "Tsy nahomby ny fanombohana ny famoronana hira."
            });
        }

        // Averina ny task_id mba hahafahan'ny app
        // manara-maso ny fandrosoan'ny hira.
        return res.json({
            success: true,
            message: "Efa natomboka ny famoronana hira.",
            title,
            style,
            task_id: result.task_id,
            status: "pending",
            audioUrl: null
        });

    } catch (error) {
        console.error("GENERATE ERROR:", error);

        return res.status(500).json({
            success: false,
            error: "Nisy olana tamin'ny serveur."
        });
    }
});

// Manamarina raha efa vita ilay hira
app.get("/task/:taskId", async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({
                success: false,
                error: "MUSICAPI_API_KEY tsy voapetraka."
            });
        }

        const taskId = req.params.taskId;

        if (!taskId || taskId.length > 200) {
            return res.status(400).json({
                success: false,
                error: "task_id tsy mety."
            });
        }

        const response = await fetch(
            `${API_BASE}/task/${encodeURIComponent(taskId)}`,
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("TASK ERROR:", result);

            return res.status(502).json({
                success: false,
                error: result.message ||
                    result.error ||
                    "Tsy afaka nijery ny satan'ny hira."
            });
        }

        const songs = Array.isArray(result.data)
            ? result.data
            : result.data
                ? [result.data]
                : [];

        const song = songs.find(
            item => item.audio_url || item.audioUrl
        );

        const status = String(
            result.status ||
            result.data?.status ||
            (song ? "succeeded" : "pending")
        ).toLowerCase();

        if (
            result.type === "failed" ||
            result.type === "forbidden" ||
            result.type === "api_error" ||
            status === "failed"
        ) {
            return res.json({
                success: false,
                status: "failed",
                error: result.message ||
                    "Tsy nahomby ny famoronana hira."
            });
        }

        if (song) {
            return res.json({
                success: true,
                status: "succeeded",
                title: song.title || "",
                audioUrl: song.audio_url || song.audioUrl,
                imageUrl: song.image_url || null
            });
        }

        return res.json({
            success: true,
            status,
            message: "Mbola eo am-pamoronana ny hira.",
            audioUrl: null
        });

    } catch (error) {
        console.error("TASK CHECK ERROR:", error);

        return res.status(500).json({
            success: false,
            error: "Nisy olana tamin'ny fanaraha-maso ny hira."
        });
    }
});

app.listen(PORT, () => {
    console.log(`STYVIO MUSIC server running on port ${PORT}`);
});
