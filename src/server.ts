import express, { Application, Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import { configPath, config } from "./config";
import { scheduledJobs } from "./scheduler";

const app: Application = express();
app.use(express.json());

const catalogPath = path.join(__dirname, "./catalog.json");

app.get("/config", (req: Request, res: Response): void => {
    try {
        const configData = fs.readJsonSync(configPath);
        res.json(configData);
    } catch (error) {
        res.status(500).json({ error: "Could not read configuration file." });
    }
});

app.post("/config", (req: Request, res: Response): void => {
    try {
        const newConfig = req.body;
        fs.writeJsonSync(configPath, newConfig, { spaces: 2 });
        res.json({ message: "Configuration updated! Restarting service to apply changes." });

        // Restart the service to apply new settings
        setTimeout(() => {
            process.exit(0);
        }, 2000);
    } catch (error) {
        res.status(500).json({ error: "Could not update configuration." });
    }
});

app.get("/catalog", (req: Request, res: Response): void => {
    try {
        if (!fs.existsSync(catalogPath)) {
            res.status(404).json({ message: "No catalog data available yet." });
            return;
        }
        const catalogData = fs.readJsonSync(catalogPath);
        res.json(catalogData);
    } catch (error) {
        res.status(500).json({ error: "Could not read catalog data." });
    }
});

app.get("/next-run", (req: Request, res: Response): void => {
    const now = new Date();
    const nextRuns = scheduledJobs
        .map((job) => ({
            time: job.nextInvocation(),
        }))
        .filter((job) => job.time > now)
        .sort((a, b) => a.time.getTime() - b.time.getTime());

    if (nextRuns.length === 0) {
        res.status(404).json({ message: "No scheduled runs found." });
        return;
    }

    res.json({ next_runs: nextRuns.map((run) => run.time) });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 REST API is running on http://localhost:${PORT}`);
});
