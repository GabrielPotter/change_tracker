
# 🛠️ Git Repository Monitor with YAML Validation & Email Notifications

## 📌 Overview
This **TypeScript-based** Node.js service automates:
- **Cloning multiple Git repositories** and checking specific folders for YAML files.
- **Validating YAML files** against assigned **JSON Schema** definitions.
- **Tracking changes** in key-value pairs inside YAML files.
- **Sending email notifications** when:
  - A new YAML file appears in a tracked folder.
  - A YAML file’s key-value changes.
- **Using a catalog system** (`catalog.json`) to maintain state across multiple runs.
- **Providing a REST API** to modify the configuration dynamically.
- **Scheduling execution** based on predefined time slots.

---

## 🚀 Features
✔️ **Multi-repository tracking**  
✔️ **Folder-specific JSON Schema validation** for YAML files  
✔️ **Tracks YAML changes using key-value pairs**  
✔️ **Emails a single notification to multiple recipients**  
✔️ **Scheduled execution (everyday, weekdays, or custom days & times)**  
✔️ **REST API for real-time configuration updates**  
✔️ **Catalog system (`catalog.json`) to track YAML states**  

---

## 🏗️ Installation Guide

### 1️⃣ **Clone the Repository**
```sh
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Configure the Service**
Modify **`src/config.json`** to set up:
- **Git repositories** to monitor.
- **Folders to scan inside each repository**.
- **JSON Schema for YAML validation**.
- **Key-value pairs to track**.
- **SMTP settings** for email notifications.
- **Execution schedule**.

Example `config.json`:
```json
{
  "schedule": {
    "days": "workday",
    "times": ["08:00", "12:00", "18:30"]
  },
  "repositories": [
    {
      "repoUrl": "https://github.com/user/repo1.git",
      "localPath": "./temp-repo1",
      "branch": "main",
      "targetFolders": [
        { "path": "config", "schema": "schemas/configSchema.json", "key_label": "version", "key_value": "1.0.0" }
      ]
    }
  ],
  "email": {
    "sender": "noreply@example.com",
    "recipients": ["recipient1@example.com"],
    "smtp": {
      "host": "smtp.example.com",
      "port": 587,
      "auth": {
        "user": "user@example.com",
        "pass": "yourpassword"
      }
    }
  }
}
```

### 4️⃣ **Run the Service**
#### 🔹 **Development Mode (Auto Restart)**
```sh
npm run dev
```
- Uses `nodemon` to restart the service on file changes.

#### 🔹 **Production Mode**
```sh
npm run build
npm start
```
- **Compiles TypeScript to JavaScript (`dist/` folder)** and runs it.

---

## 📜 Project Structure
```
/git-monitor-service
  ├── src/                  # Source Code
  │   ├── services/
  │   │   ├── gitService.ts       # Clones repositories & fetches latest commits
  │   │   ├── yamlService.ts      # Validates YAML files & tracks changes
  │   │   ├── emailService.ts     # Sends email notifications
  │   ├── config.json        # User configuration (repositories, folders, schedules)
  │   ├── server.ts          # REST API for managing config dynamically
  │   ├── scheduler.ts       # Manages scheduled execution
  │   ├── index.ts           # Main entry point
  ├── dist/                  # Compiled TypeScript output (ignored in Git)
  ├── schemas/               # JSON Schema files for YAML validation
  │   ├── configSchema.json
  │   ├── settingsSchema.json
  ├── catalog.json           # Stores state of YAML files (ignored in Git)
  ├── package.json
  ├── tsconfig.json
  ├── .gitignore
  ├── README.md
```

---

## ⚙️ Configuration Details

### 🔹 **Git Repository Tracking**
- **`repoUrl`**: The URL of the Git repository.
- **`localPath`**: Where to clone the repository.
- **`branch`**: The branch to track.
- **`targetFolders`**: List of folders to scan for YAML files.

### 🔹 **YAML Schema Validation**
Each folder must have:
- **`schema`**: A **JSON Schema** file for validation.
- **`key_label`**: The **YAML key to track**.
- **`key_value`**: The **expected initial value**.

### 🔹 **Catalog System (`catalog.json`)**
- Stores previous YAML key-value states.
- Helps detect:
  - **New YAML files** (not seen before).
  - **Modified values** in existing YAML files.

### 🔹 **Scheduled Execution**
Configure **which days and times** the service runs:
```json
"schedule": {
  "days": ["monday", "friday"],
  "times": ["07:00", "14:30"]
}
```
**Available options for `days`:**
- `"everyday"` → Runs every day.
- `"workday"` → Runs only on weekdays (Mon-Fri).
- `["monday", "friday"]` → Runs on specific days.

### 🔹 **Email Notifications**
- **New YAML file detected** → Sends an **"🆕 New entry"** notification.
- **YAML value changed** → Sends an **"🔄 Updated"** notification.
- **No change** → No email is sent.

Example email:
```
📌 YAML File Changes Detected:

🆕 New entry: repo1/config/config.yaml (version=1.0.0)
🔄 Updated: repo1/settings/settings.yaml (enabled changed from false → true)
```

---

## 📡 REST API Usage

### **🔍 Get Current Config**
```sh
curl -X GET http://localhost:3000/config
```

### **✏️ Update Config**
```sh
curl -X POST http://localhost:3000/config \
  -H "Content-Type: application/json" \
  -d '{
    "schedule": {
      "days": "workday",
      "times": ["07:00", "14:30"]
    }
  }'
```
✅ **Modifies the schedule dynamically without restarting the service!**  

---

## 🔧 Troubleshooting

### **🛠 Reset the Catalog**
```sh
rm catalog.json
```
- Resets the YAML tracking system.

### **📌 YAML Validation Issues?**
- Ensure YAML files follow the **correct JSON Schema**.
- Validate manually:
  ```sh
  npx ts-node src/services/yamlService.ts
  ```

### **📌 Email Not Sending?**
- Check `config.json` SMTP settings.
- Verify SMTP credentials (e.g., use **app passwords** for Gmail, Yahoo, etc.).
- Send a test email manually:
  ```sh
  telnet smtp.example.com 587
  ```
