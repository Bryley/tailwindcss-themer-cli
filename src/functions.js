import { toThemes } from "./theme.js";
import { ThemesSchema } from "./schema.js";
import yaml from "yaml";

/**
 * @param {string} input
 *
 * @returns {import("./theme.js").Themes}
 */
export function parseThemeYaml(input) {
  const data = yaml.parse(input);
  const themes = toThemes(ThemesSchema.parse(data));
  return themes;
}

