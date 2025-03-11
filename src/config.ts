import fs from "fs-extra";
import path from "path";

export const configPath = path.join(__dirname, "./config.json");
export interface TargetFolder {
    path: string;
    schema: string;
    label_key: string;
    value_key: string;
}
export interface RepoConfig {
    repoUrl: string;
    localPath: string;
    branch: string;
    targetFolders: TargetFolder[];
}
export interface ConfigData {
    schedule: {
        days: string;
        times: string[];
    };
    repositories: RepoConfig[];
    email: {
        sender: string;
        recipients: string[];
        smtp: {
            host: string;
            port: number;
            auth: {
                user: string;
                pass: string;
            };
        };
    };
}

export function loadConfig() {
    if (!fs.existsSync(configPath)) {
        console.error(`❌ Config file not found: ${configPath}`);
        process.exit(1);
    }
    return fs.readJsonSync(configPath);
}

export let config: ConfigData = loadConfig(); // 🔄 Betöltjük a konfigurációt

// 📌 Automatikusan újraolvassuk a `config.json` fájlt, ha változik
fs.watchFile(configPath, { interval: 2000 }, () => {
    console.log("🔄 Config file changed! Reloading...");
    try {
        config = loadConfig();
        console.log("✅ New configuration loaded successfully.");
    } catch (error) {
        console.error("❌ Failed to reload config:", error);
    }
});
