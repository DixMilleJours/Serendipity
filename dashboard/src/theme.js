import { pink, teal, grey, blueGrey } from "@mui/material/colors";

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // dark mode palette
            primary: {
              dark: pink[400],
              main: pink[300],
              light: pink[600],
            },
            neutral: {
              dark: "#E0E0E0",
              main: "#C2C2C2",
              mediumMain: "#A3A3A3",
              medium: "#858585",
              light: "#333333",
            },
            background:{
              // default: grey[900]
              default: "black"
            }
          }
        : {
            // light mode palette
            primary: {
              dark: "#d9687e",
              main: "#fe4066",
              light: pink[200],
            },
            neutral: {
              dark: "#333333",
              main: "#666666",
              mediumMain: "#858585",
              medium: "#A3A3A3",
              light: "#F0F0F0",
            },
            background:{
              default: grey[50]
            }
          }),
    },
    typography: {
      fontSize: 14,
      subtitle1: {
        fontSize: 12,
      },
      button: {
        textTransform: "none",
        fontWeight: "30pt",
        fontFamily: "sans-serif ",
        margin: "20px 20px",
        fontWeight: "bold",
      },
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
  };
};
