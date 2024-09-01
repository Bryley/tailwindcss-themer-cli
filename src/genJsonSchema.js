import { zodToJsonSchema } from "zod-to-json-schema";
import { ThemesSchema } from "./schema.js";
import fs from "fs";


const contents = zodToJsonSchema(ThemesSchema, "ThemesConfig");
fs.writeFileSync("./theme.schema.json", JSON.stringify(contents, null, 2), "utf-8");
console.log("Saved schema file");
