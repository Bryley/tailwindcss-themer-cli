#!/usr/bin/env node

import { toThemes } from "./theme.js";
import { ThemesSchema } from "./schema.js";
import yaml from "yaml";
import { readFileSync } from "fs";
import fs from "fs";
import path from "path";
import {
  generateCss,
  generateJavascriptCode,
  generateTailwindConfigColors,
} from "./generator.js";
import { program } from "commander";

/**
 * @param {import("./theme.js").Themes} input
 *
 * @returns {{[key: string]: string}}
 */
export function createColors(input) {
  return generateTailwindConfigColors(input);
}

/**
 * @param {string} input
 *
 * @returns {import("./theme.js").Themes}
 */
export function parseThemeYaml(input) {
  const data = yaml.parse(input);

  const themes = toThemes(ThemesSchema.parse(data));

  const css = generateCss(themes);
  fs.writeFileSync(cssOutput, css, "utf-8");
  console.log("Tailwind CSS file generated successfully!");

  return themes;
}

/**
 * @param {import("./theme.js").Themes} themes
 */
export function updateTailwindConfig(themes) {
  const colors = generateTailwindConfigColors(themes);
  const jsonColors = JSON.stringify(colors, null, 2);
  const tailwindConfFile = themes.tailwindConfig.replace(
    "$TAILWIND_COLORS",
    jsonColors,
  );

  const configPath = path.resolve("./tailwind.config.js");

  fs.writeFileSync(configPath, tailwindConfFile, "utf8");

  console.log("Tailwind configuration has been updated successfully!");
}

program
  .name("tailwind-themer")
  .description("CLI tool to generate tailwind theming code");

program
  .command("js-template")
  .description("Generates basic top level JS code for switching themes")
  .option("-o, --output <string>", "The output file for the code", "./theme.js")
  .action(function () {
    generateJavascriptCode(this.opts().output);
  });

program
  .command("generate")
  .option("-t, --theme-file <string>", "Sets theme file", "./theme.yaml")
  .option(
    "-o, --css-output <string>",
    "The output file for the css code",
    "./tailwind.css",
  )
  .description(
    "Updates the tailwind.config.js file and generates a CSS file with the updated themes",
  )
  .action(function () {
    const themeFile = this.opts().themeFile;
    const cssOutput = this.opts().cssOutput;
    const file = readFileSync(themeFile, "utf-8");

    const themes = parseThemeYaml(file);
    updateTailwindConfig(themes);
    const css = generateCss(themes);
    fs.writeFileSync(cssOutput, css, "utf-8");
    console.log("Tailwind CSS file generated successfully!");
  });

program.parse();
