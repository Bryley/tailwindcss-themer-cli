# `tailwindcss-themer-cli`

`tailwindcss-themer-cli` is a small JavaScript library that can be used with
Tailwind for managing different themes and the colors for each of those themes.

## How it works?

To use this library is pretty simple.
All you have to do is reference the `tailwindThemerColors` function inside your
tailwind.config.js file like so:

```javascript
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
```

Calling this function will do 2 things:

1. Parse all the theme colors and return an object that can be understood by
   Tailwind
1. Will generate a CSS file (output specified by the `cssOutputPath` field) that
   contains all the color definitions. This is the CSS file you will reference
   before the build process.

That's it! That tailwind.css file will be generated every time tailwind decides
to read the config file.

## How to change themes?

By default, this library will use the users preferred color scheme to set the
theme. However, you can force change the theme by setting the class on the HTML
body tag to whatever you named your theme. No need for `dark:` variant anymore!

e.g. If you want to force dark mode (assuming you named one of your themes `dark`):

```html
...
<body class="dark">
  ...
</body>
...
```
