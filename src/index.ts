import { GitService } from "./services/gitService";
import { YamlService } from "./services/yamlService";
import { EmailService } from "./services/emailService";
import "./server"; // REST API elindítása
import { startScheduler } from "./scheduler";

const gitService = new GitService();
const yamlService = new YamlService();
const emailService = new EmailService();

export async function main() {
    console.log("🚀 Starting git repo monitoring...");
    await gitService.cloneAndPrepareRepos();
    const changes = await yamlService.checkForChanges();
    console.log(changes);
    await emailService.sendReport(changes);
}

function getArgValue(flag: string): string | null {
    const index = process.argv.indexOf(flag);
    return index !== -1 && index + 1 < process.argv.length ? process.argv[index + 1] : null;
}

const mode = getArgValue("--mode") || "scheduler"; // Default to "scheduler" if no mode is provided


switch (mode) {
    case "scheduler":
        console.log("Starting in SCHEDULER mode...");
        startScheduler(); // Starts the service with scheduling
        break;

    case "manual":
        console.log("Running MANUAL YAML processing...");
        main().catch(console.error); // Runs the YAML processor once
        break;

    case "api":
        console.log("API Mode: Only REST API is running...");
        // No extra action needed, server.ts is already imported
        break;

    default:
        console.log("Unknown mode. Running default mode (Scheduler)...");
        startScheduler(); // Default mode
        break;
}
