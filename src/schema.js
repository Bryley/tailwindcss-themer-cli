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
  z.string(), // A single color as a string, e.g., "#abcdef"
  z.object({
    start: z.string(), // Start color as a string, e.g., "#000000"
    end: z.string(), // End color as a string, e.g., "#ffffff"
  }),
  z.object({
    middle: z.string(),
    intensities: z
      .record(z.string(), z.tuple([z.number(), z.number(), z.number()]))
      .default(DEFAULT_INTENSITIES),
  }),
  z.record(z.string(), z.string()),
  z.array(z.string()), // An array of colors, e.g., ["#000000", "#ffffff"]
]);

/**
 * @typedef {z.infer<typeof ThemeSchema>} RawTheme
 */
export const ThemeSchema = z.object({
  colors: z.record(ColorSchema), // Record of colors, where each key is a color name and the value is a color object/string/array
  "color-scheme": z.enum(["light", "dark"]).default("light"), // Optional color scheme; will be set to "light" or "dark" depending on the theme key
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
  "default-light-theme": z.string().optional(),
  "default-dark-theme": z.string().optional(),
  themes: z.record(z.string(), ThemeSchema),
  // themes: z.record(z.string(), ThemeSchema).refine((themes) => {
  //   // Set default values for color-scheme if not provided
  //   Object.entries(themes).forEach(([_, themeValue]) => {
  //     if (!themeValue["color-scheme"]) {
  //       themeValue["color-scheme"] = "light"; // Default to theme key (light, dark, etc.)
  //     }
  //   });
  //   return true;
  // }),
  "tailwind-config-template": z.string().default(DEFAULT_TAILWIND_CONF),
});
