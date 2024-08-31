import chroma from "chroma-js";

/**
 * @typedef {Object} Themes
 * @property {string} defaultLightTheme
 * @property {string | null} defaultDarkTheme
 * @property {string} tailwindConfig
 * @property {Theme[]} themes
 */

/**
 * @typedef {Object} Theme
 * @property {string} name
 * @property {"light" | "dark"} colorScheme
 * @property {ThemeColor[]} colors
 */

/**
 * @typedef {Object} ThemeColor
 * @property {string} name
 * @property {chroma.Color} color
 */

/**
 * @param {Themes} themes
 * @returns {[string, "light" | "dark"][]}
 */
export function getAllThemes(themes) {
  /**
   * @type {[string, "light" | "dark"][]}
   */
  const themeNames = [];
  for (const theme of themes.themes) {
    themeNames.push([theme.name, theme.colorScheme]);
  }
  return themeNames;
}

/**
 * @param {Themes} themes
 * @returns {string[]}
 */
export function getAllColors(themes) {
  /**
   * @type {string[]}
   */
  const colorNames = [];

  for (const theme of themes.themes) {
    for (const col of theme.colors) {
      colorNames.push(col.name);
    }
  }

  return colorNames;
}

/**
 * @param {import("./schema.js").RawThemes} raw
 * @returns {Themes}
 */
export function toThemes(raw) {
  /** @type {Theme[]} */
  let themes = [];
  for (const name in raw.themes) {
    themes = [...themes, toTheme(name, raw.themes[name])];
  }

  return {
    defaultLightTheme: raw["default-light-theme"] ?? themes[0].name,
    defaultDarkTheme: raw["default-dark-theme"] ?? null,
    tailwindConfig: raw["tailwind-config-template"],
    themes,
  };
}

/**
 * @param {string} name
 * @param {import("./schema.js").RawTheme} raw
 *
 * @returns {Theme}
 */
function toTheme(name, raw) {
  /** @type {ThemeColor[]} */
  let colors = [];
  for (const name in raw.colors) {
    colors = [...colors, ...toColor(name, raw.colors[name])];
  }

  return {
    name,
    colors,
    colorScheme: raw["color-scheme"] ?? "light",
  };
}

/**
 * @param {string} name
 * @param {import("./schema.js").RawColor} raw
 * @returns {ThemeColor[]}
 */
function toColor(name, raw) {
  if (typeof raw === "string") {
    return [
      {
        name,
        color: chroma(raw),
      },
    ];
  }
  if (Array.isArray(raw)) {
    return raw.map((col, index) => {
      return {
        name: `${name}-${index + 1}`,
        color: chroma(col),
      };
    });
  }
  if ("middle" in raw && "intensities" in raw) {
    const col = chroma(raw.middle);
    return Object.entries(raw.intensities).map(([num, intensity]) => {
      return {
        name: `${name}-${num}`,
        color: adjustColor(col, intensity),
      };
    });
  }
  if ("start" in raw && "end" in raw) {
    const [startH, startS, startL] = chroma(raw.start).hsl();
    const [endH, endS, endL] = chroma(raw.end).hsl();

    const JUMPS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    const hueJump = (endH - startH) / JUMPS.length;
    const satJump = (endS - startS) / JUMPS.length;
    const lightJump = (endL - startL) / JUMPS.length;

    return JUMPS.map((x, index) => {
      return {
        color: chroma(
          startH + hueJump * index,
          startS + satJump * index,
          startL + lightJump * index,
          "hsl",
        ),
        name: `${name}-${x}`,
      };
    });
  }

  return Object.entries(raw).map((num, col) => {
    return {
      name: `${name}-${num}`,
      color: chroma(col),
    };
  });
}

/**
 * @param {chroma.Color} col
 * @param {[number, number, number]} intensities
 *
 * @returns {chroma.Color}
 */
function adjustColor(col, intensities) {
  const [h, s, l] = col.hsl();
  const [hInt, sInt, lInt] = intensities;

  return chroma(h * (1 + hInt), s * (1 + sInt), l * (1 + lInt), "hsl");
}
