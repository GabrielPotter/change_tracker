import { execSync } from "child_process";
import fs from "fs-extra";
import { config } from "../config";

export class GitService {
  async cloneAndPrepareRepos(): Promise<void> {
    for (const repo of config.repositories) {
      this.cleanupRepo(repo.localPath);
      console.log(`📥 Cloning repository: ${repo.repoUrl} (branch: ${repo.branch})`);
      this.runGitCommand(`git clone --depth=1 --single-branch --branch ${repo.branch} ${repo.repoUrl} ${repo.localPath}`);
      console.log(`✅ Cloned ${repo.repoUrl} to ${repo.localPath}`);
    }
  }

  private cleanupRepo(repoPath: string): void {
    if (fs.existsSync(repoPath)) {
      console.log(`🗑 Removing existing repo: ${repoPath}`);
      fs.removeSync(repoPath);
    }
  }

  private runGitCommand(command: string): void {
    try {
      execSync(command, { stdio: "inherit" });
    } catch (error) {
      console.error(`❌ Git command failed: ${command}`, error);
      process.exit(1);
    }
  }
}
