import express from "express";
import fs from "fs-extra";
import { configPath, config } from "./config";

const app = express();
app.use(express.json());

// 📌 Konfiguráció LEKÉRDEZÉSE
app.get("/config", (req, res) => {
  res.json(config);
});

// 📌 Konfiguráció MÓDOSÍTÁSA
app.post("/config", (req, res) => {
  try {
    const newConfig = req.body;
    fs.writeJsonSync(configPath, newConfig, { spaces: 2 }); // JSON fájl frissítése
    res.json({ message: "Configuration updated! The service is now using the new settings." });
  } catch (error) {
    res.status(500).json({ error: "❌ Could not update configuration" });
  }
});

// 📌 REST API indítása
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 REST API is running on http://localhost:${PORT}`);
});
