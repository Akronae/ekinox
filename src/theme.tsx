import { createTheme, type CSSVariablesResolver, Input } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "prim",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    fontWeight: "900",
    sizes: {
      h1: { fontSize: "50px", fontWeight: "900" },
      h2: { fontSize: "40px", fontWeight: "900" },
      h3: { fontSize: "28px", fontWeight: "bold" },
      h4: { fontSize: "22px", fontWeight: "bold" },
      h5: { fontSize: "18px", fontWeight: "600" },
      h6: { fontSize: "16px", fontWeight: "600" },
    },
  },
  colors: {
    prim: [
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
    ],
    dark: [
      "#acaeb4",
      "#797c83",
      "#64656d",
      "#32373e",
      "#222",
      "#1a1a1a",
      "#121212",
      "#0d0d0d",
      "#090a0e",
      "#000",
    ],
  },
  components: {
    Input: Input.extend({
      styles: {
        input: {
          borderRadius: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          borderWidth: "2px",
        },
      },
    }),
  },
});

export const cssVarResolver: CSSVariablesResolver = (_theme) => ({
  /** Shared CSS variables that should be accessible independent from color scheme */
  variables: {},
  /** CSS variables available only in dark color scheme */
  light: {},
  /** CSS variables available only in light color scheme */
  dark: {},
});
