import { GitService } from "./services/gitService";
import { YamlService } from "./services/yamlService";
import { EmailService } from "./services/emailService";
import "./server"; // REST API elindítása
import { scheduleTasks } from "./scheduler";

const gitService = new GitService();
const yamlService = new YamlService();
const emailService = new EmailService();

export async function main() {
  console.log("🚀 Starting git repo monitoring...");

  await gitService.cloneAndPrepareRepos();
  const changes = await yamlService.checkForChanges();
  await emailService.sendReport(changes);
}

// 📌 Ütemezett futtatás elindítása
scheduleTasks();
