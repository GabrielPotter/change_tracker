
# Git Repository Monitor with YAML Validation & Email Notifications

## Overview

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

## Installation Guide

###  **Clone the Repository**
```sh
git clone <your-repo-url>
cd <your-repo-folder>
```

###  **Install Dependencies**
```sh
npm install
```

###  **Configure the Service**
Modify **`src/config.json`** to set up:
- **Git repositories** to monitor.
- **Folders to scan inside each repository**.
- **JSON Schema for YAML validation**.
- **Key to track**.
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
        { "path": "config", 
        "schema": "schemas/configSchema.json",
         "label_key": "key1.key2.label",
          "value_key": "key1.key3.version" }
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

###  **Run the Service**

```sh
npm run build
node dist/index.js --mode <mode-val>
```
The possibile mode values
- scheduler starting in scheduler mode
- manual runs the process once
- api only the rest api runs

---

## REST API Usage

### **Get Current Config**
```sh
curl -X GET http://localhost:3000/config
```

### **Update Config**
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
### Read the actula catalog
```sh
curl -X GET http://localhost:3000/catalog
```

### Get the next scheduked run
```sh
curl -X GET http://localhost:3000/next-run
```