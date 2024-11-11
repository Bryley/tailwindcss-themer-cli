const { tailwindThemerColors } = require("tailwindcss-themer-cli");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    colors: tailwindThemerColors({
      defaultLightTheme: "light",
      defaultDarkTheme: "dark", // Optional
      cssOutputPath: "./tailwind.css", // Optional (./tailwind.css is the default)
      themes: [
        {
          name: "light",
          colorScheme: "light",
          colors: {
            slate: "#cfcfcf",
            contrast: "#3d3d3d",
            success: "#14993e",
            error: "#a64737",
          },
        },
        {
          name: "dark",
          colorScheme: "dark",
          colors: {
            slate: "#2e2d2d",
            contrast: "#dedede",
            success: "#14993e",
            error: "#a64737",
          },
        },
        // You can have as many themes as you would like...
      ],
    }),
  },
  plugins: [],
};
