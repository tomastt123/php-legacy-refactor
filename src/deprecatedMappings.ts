import * as fs from "fs";
import * as path from "path";

const deprecatedJsonPath = path.join(__dirname, "..", "php-analyzer", "deprecatedMappings.json");

export let deprecatedFunctions: Record<string, string> = {};

try {
    const data = fs.readFileSync(deprecatedJsonPath, "utf8");
    deprecatedFunctions = JSON.parse(data);
} catch (error) {
    console.error("Error loading deprecated mappings:", error);
}
