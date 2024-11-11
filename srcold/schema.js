import { z } from "zod";

const DEFAULT_INTENSITIES = {
  100: [-0.05, -0.5, 0.8],
  200: [-0.03, -0.35, 0.65],
  300: [-0.01, -0.2, 0.4],
  400: [-0.005, -0.1, 0.2],
  500: [0, 0, 0],
  600: [0.005, 0.1, -0.15],
  700: [0.01, 0.2, -0.3],
  800: [0.03, 0.35, -0.45],
  900: [0.05, 0.5, -0.6],
};

/**
 * @typedef {z.infer<typeof ColorSchema>} RawColor
 */
export const ColorSchema = z.union([
  z.string().describe("A single color as RGB hex"),
  z.object({
    start: z.string().describe("The start color (color 100)"),
    end: z.string().describe("The end color (color 900)"),
  }).describe("Describe start and end of gradient to generate"),
  z.object({
    middle: z
      .string()
      .describe("The middle color (500) for shades to generate around"),
    intensities: z
      .record(z.string(), z.tuple([z.number(), z.number(), z.number()]))
      .default(DEFAULT_INTENSITIES)
      .describe(
        "The intensities for each step to set with tuples [H, S, L] as percentage adjustments",
      ),
  }).describe("Generate shade from middle color"),
  z.record(z.string(), z.string()).describe("Custom shades"),
  z.array(z.string()).describe("Array of colors to use"),
]);

/**
 * @typedef {z.infer<typeof ThemeSchema>} RawTheme
 */
export const ThemeSchema = z.object({
  colors: z
    .record(ColorSchema)
    .describe("List of color definitions for the theme"), // Record of colors, where each key is a color name and the value is a color object/string/array
  "color-scheme": z
    .enum(["light", "dark"])
    .default("light")
    .describe("If this theme is a light or dark theme"), // Optional color scheme; will be set to "light" or "dark" depending on the theme key
});

const DEFAULT_TAILWIND_CONF = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    colors: $TAILWIND_COLORS,
  },
  plugins: [],
}
`;

/**
 * @typedef {z.infer<typeof ThemesSchema>} RawThemes
 */
export const ThemesSchema = z.object({
  "default-light-theme": z
    .string()
    .optional()
    .describe("Default theme to use for light mode"),
  "default-dark-theme": z
    .string()
    .optional()
    .describe("Default theme to use for dark mode"),
  themes: z
    .record(z.string(), ThemeSchema)
    .describe("The themes available for the application"),
  "tailwind-config-template": z
    .string()
    .default(DEFAULT_TAILWIND_CONF)
    .describe(
      "The template to fill the `tailwind.config.js`, `$TAILWIND_COLORS` gets replaced with the colors for all the themes",
    ),
});
