import { generateCss, generateTailwindConfigColors } from "./generator.js";
import fs from "fs";

/**
 * @param {import("./types").ThemeConfig} input
 *
 * @returns {{[key: string]: string}}
 * The definitions of the colors to use, also generates tailwind.css for you to
 * reference.
 */
export function tailwindThemerColors(input) {
  const cssOutput = input.cssOutputPath ?? "./tailwind.css";

  const css = generateCss(input);
  fs.writeFileSync(cssOutput, css, "utf-8");

  return generateTailwindConfigColors(input);
}
