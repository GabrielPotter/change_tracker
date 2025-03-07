import nodemailer from "nodemailer";
import fs from "fs-extra";
import { config } from "../config";

export class EmailService {
  private transporter = nodemailer.createTransport(config.email.smtp);

  async sendReport(changes: string[]): Promise<void> {
    if (changes.length === 0) {
      console.log("✅ No changes detected, no email sent.");
      return;
    }

    const report = changes.join("\n");
    const filePath = "./change_report.txt";
    fs.writeFileSync(filePath, report);

    for (const recipient of config.email.recipients) {
      try {
        await this.transporter.sendMail({
          from: config.email.sender,
          to: recipient, // 📌 Minden címzett külön emailt kap
          subject: "🔄 YAML Changes Detected",
          text: `Changes were detected in the YAML files.\n\nSee attached report.`,
          attachments: [{ filename: "change_report.txt", path: filePath }],
        });

        console.log(`📧 Email sent successfully to ${recipient}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${recipient}:`, error);
      }
    }
  }
}
