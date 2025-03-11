import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { config } from "../config";

const catalogPath = path.join(__dirname, "../catalog.json");

export class YamlService {
    private ajv = new Ajv({ allErrors: true });

    constructor() {
        addFormats(this.ajv);
    }
    getNestedValue(obj: any, path: string): any {
        return path.split(".").reduce((acc, key) => acc && acc[key], obj);
    }
    async checkForChanges(): Promise<string[]> {
        const changedFiles: string[] = [];
        const catalog = this.loadCatalog();

        for (const repo of config.repositories) {
            if (!catalog[repo.repoUrl]) {
                catalog[repo.repoUrl] = {};
            }

            for (const folderConfig of repo.targetFolders) {
                const folderPath = path.join(process.cwd(), repo.localPath, folderConfig.path);
                const schemaPath = path.join(__dirname, "../schemas", folderConfig.schema);
                const labelKey = folderConfig.label_key;
                const valueKey = folderConfig.value_key;

                if (!fs.existsSync(folderPath) || !fs.existsSync(schemaPath)) {
                    console.warn(`Skipping folder: ${folderPath} (Schema not found: ${schemaPath})`);
                    continue;
                }

                const schema = fs.readJsonSync(schemaPath);
                const validate = this.ajv.compile(schema);
                const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));

                if (!catalog[repo.repoUrl][folderConfig.path]) {
                    catalog[repo.repoUrl][folderConfig.path] = {};
                }

                for (const file of files) {
                    const filePath = path.join(folderPath, file);
                    const yamlContent = this.loadYaml(filePath);

                    if (!yamlContent || !validate(yamlContent)) {
                        console.warn(`Invalid YAML file skipped: ${filePath}`);
                        continue;
                    }

                    const label = this.getNestedValue(yamlContent, labelKey);
                    const value = this.getNestedValue(yamlContent, valueKey);

                    if (!label || typeof label !== "string") {
                        console.warn(`Missing or invalid label '${labelKey}' in ${filePath}, skipping.`);
                        continue;
                    }

                    if (value === undefined) {
                        console.warn(`Missing key_value '${valueKey}' in ${filePath}, skipping.`);
                        continue;
                    }

                    if (!catalog[repo.repoUrl][folderConfig.path][file]) {
                        changedFiles.push(`New entry: ${file} ${label} (${valueKey}=${value})`);
                    } else {
                        const oldValue = catalog[repo.repoUrl][folderConfig.path][file].value;
                        if (oldValue !== value) {
                            changedFiles.push(
                                `Updated: ${file} ${label} (${valueKey} changed from ${oldValue} to ${value})`
                            );
                        } else {
                            continue;
                        }
                    }

                    catalog[repo.repoUrl][folderConfig.path][file] = { label: label, value: value };
                }
            }
        }

        this.saveCatalog(catalog);
        return changedFiles;
    }

    private loadYaml(filePath: string): Record<string, any> | null {
        try {
            const fileContents = fs.readFileSync(filePath, "utf8");
            const parsedYaml = yaml.load(fileContents);
            return typeof parsedYaml === "object" && parsedYaml !== null ? (parsedYaml as Record<string, any>) : null;
        } catch (error) {
            console.error(`Error loading YAML file: ${filePath}`, error);
            return null;
        }
    }

    private loadCatalog(): Record<string, any> {
        return fs.existsSync(catalogPath) ? fs.readJsonSync(catalogPath) : {};
    }

    private saveCatalog(catalog: Record<string, any>): void {
        fs.writeJsonSync(catalogPath, catalog, { spaces: 2 });
    }
}
