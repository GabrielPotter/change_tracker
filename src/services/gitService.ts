import { execSync } from "child_process";
import fs from "fs-extra";
import { config } from "../config";
import path from "path";

export class GitService {
    async cloneAndPrepareRepos(): Promise<void> {
        for (const repo of config.repositories) {
            const repoPath = path.join(process.cwd(),repo.localPath,)
            this.cleanupRepo(repoPath);
            console.log(`Cloning repository: ${repo.repoUrl} (branch: ${repo.branch})`);
            this.runGitCommand(
                `git clone --depth=1 --single-branch --branch ${repo.branch} ${repo.repoUrl} ${repoPath}`
            );
            console.log(`Cloned ${repo.repoUrl} to ${repoPath}`);
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
            console.error(`Git command failed: ${command}`, error);
            process.exit(1);
        }
    }
}
