
# `tailwindcss-themer-cli`

`tailwindcss-themer-cli` is a basic cli code generation tool for generating your:

- `tailwind.config.js`
- `tailwind.css`

For your file, automatically setting up as many themes as you would like that can
be easily switched by changing a single source of truth in a yaml file (usually
called `theme.yaml`).

This tool has the power to generate palettes and swatches for your brand colors.


## Usage

  js-template [options]  Generates basic top level JS code for switching themes
  generate [options]     Updates the tailwind.config.js file and generates a CSS file with
                         the updated themes
  help [command]         display help for command

This tool has 2 commands:

### `npx tailwindcss-themer-cli generate`

** WARNING **: Running this command will replace your tailwind.config.js file,
please backup anything in that file that you believe is important before
continuing.

This will update both `tailwind.config.js` and create/replace a new file called
`tailwind.css` by default that contains all the colors defined so you can use
them in your tailwindcss project.

It gets all your colors and themes from the `theme.yaml` file as decribed in a
later section.

This command should be ran everytime the theme.yaml file changes, I recommened
putting it in your npm scripts or Makefile.


### `npx tailwindcss-themer-cli js-template`

This will generate a very basic Javascript template for interacting with your
themes, the file will be called `theme.js` by default, if you simply link to it
in your HTML you can very easily get the current theme or switch themes using
it. This command should only be used for generating the template and is not used
for code generation.


## `theme.yaml`

The `theme.yaml` file is the main input for this application, it should sit in
your project root and act as the single source of truth for all the colors and
themes used throughout your application.

Here is an example configuration:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Bryley/tailwindcss-themer-cli/main/theme.schema.json
default-light-theme: day  # The name of the default light theme to use
default-dark-theme: night  # The name of the default dark theme to use (this is optional)

themes:
  day:  # The name of this theme (can be anything)
    color-scheme: light     # If this theme is a "light" theme or "dark" theme
    colors:
      # Slate color palette for light theme (smooth gradient of grays)
      slate:
        100: "#f9fafb"   # Lightest shade, suitable for the background
        200: "#f3f4f6"   # Very light gray, slightly darker than 100
        300: "#e5e7eb"   # Light gray, good for secondary backgrounds
        400: "#d1d5db"   # Medium-light gray, suitable for borders
        500: "#9ca3af"   # Neutral gray, perfect for default text color
        600: "#6b7280"   # Darker gray for slightly emphasized text
        700: "#4b5563"   # Dark gray for headings or primary text
        800: "#374151"   # Very dark gray for strong contrast
        900: "#1f2937"   # Darkest gray, suitable for modals, text on light backgrounds
      # Primary color with middle and gradient generation
      primary:
        middle: "#3b82f6"   # Base primary color (blue), this will generate 100 to 900 shades assuming this is 500
        intensities: # List of intensities for each color it generates, this is optional, this is the default
          100: [-0.05, -0.5, 0.8]   # [Hue Adjust, Saturation Adjust, Lightness Adjust]
          200: [-0.03, -0.35, 0.65]
          300: [-0.01, -0.2, 0.4]
          400: [-0.005, -0.1, 0.2]
          500: [0, 0, 0]
          600: [0.005, 0.1, -0.15]
          700: [0.01, 0.2, -0.3]
          800: [0.03, 0.35, -0.45]
          900: [0.05, 0.5, -0.6]
      # Contrast palette that works well with slate
      contrast:
        100: "#ffffff"   # Pure white for maximum contrast with darker grays
        200: "#f8fafc"   # Near white, slightly toned down
        300: "#f1f5f9"   # Very light gray, good for text on dark slates
        400: "#dbeafe"   # Light blue for accents
        500: "#60a5fa"   # Blue for interactive elements on gray
        600: "#3b82f6"   # Primary blue used for buttons, links, etc.
        700: "#1e40af"   # Dark blue, contrasting for text
        800: "#1e3a8a"   # Darker blue for hover states
        900: "#1e3a5f"   # Darkest shade for very strong contrast
      # Success, error, and warning colors that do not differ much between themes
      success: "#10b981"
      error: "#ef4444"
      warning: "#f59e0b"

  night: # This is the name of the dark theme
    color-scheme: dark
    colors:
      # Slate color palette for dark theme (smooth gradient of dark grays)
      slate:
        100: "#111827"   # Lightest shade for dark theme (still quite dark)
        200: "#1f2937"   # Slightly lighter than the darkest background
        300: "#27303f"   # Dark gray, good for backgrounds
        400: "#374151"   # Medium-dark gray, borders, cards
        500: "#4b5563"   # Neutral gray for text and interactive elements
        600: "#6b7280"   # Lighter gray for secondary text or icons
        700: "#9ca3af"   # Light gray for headers or emphasized text
        800: "#d1d5db"   # Very light gray, useful for contrasting backgrounds
        900: "#f3f4f6"   # Lightest, suitable for highest contrast elements
      primary:
        middle: "#3b82f6"
      contrast:
        100: "#f9fafb"   # Lightest gray, contrast for text or elements
        200: "#f3f4f6"   # Slightly darker for less stark contrast
        300: "#dbeafe"   # Light blue
        400: "#60a5fa"   # Blue for interactive elements
        500: "#3b82f6"   # Primary blue for buttons, links
        600: "#2563eb"   # Slightly darker blue for hover
        700: "#1e40af"   # Dark blue for headers
        800: "#1e3a8a"   # Even darker blue
        900: "#1e3a5f"   # Very dark blue for strong contrast
      # Success, error, and warning colors that do not differ much between themes
      success: "#10b981"
      error: "#ef4444"
      warning: "#f59e0b"
      # You can add more colors here if you'd like!

  # You can include more themes here if you'd like!

# This is optional and defines how the tailwind config should look, the text
# `$TAILWIND_COLORS` will get replaced with the colors to use. This is the
# default
tailwind-config-template: |
  /** @type {import('tailwindcss').Config} */
  export default {
    content: [],
    theme: {
      colors: $TAILWIND_COLORS,
    },
    plugins: [],
  }

```
