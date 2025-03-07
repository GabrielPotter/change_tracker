import nodemailer from "nodemailer";
import fs from "fs-extra";
import { config } from "../config";
import path from "path";

export class EmailService {
    private transporter = nodemailer.createTransport(config.email.smtp);

    async sendReport(changes: string[]): Promise<void> {
        if (changes.length === 0) {
            console.log("No changes detected, no email sent.");
            return;
        }

        const report = changes.join("\n");
        const filePath = path.join(process.cwd(),"change_report.txt");
        fs.writeFileSync(filePath, report);
        const recipients = config.email.recipients.join(", ");
        //console.log(`prepared for send ${filePath} -> ${report}`);
        try {
            await this.transporter.sendMail({
                from: config.email.sender,
                to: recipients,
                subject: "YAML Changes Detected",
                text: `Changes were detected in the YAML files.\n\nSee attached report.`,
                attachments: [{ filename: "change_report.txt", path: filePath }],
            });

            console.log(`Email sent successfully to ${recipients}`);
        } catch (error) {
            console.error(`Failed to send email to ${recipients}:`, error);
        }
    }
}
