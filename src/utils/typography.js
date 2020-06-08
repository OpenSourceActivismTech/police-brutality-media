import Typography from "typography";
import theme from "typography-theme-parnassus";

theme.headerColor = "white";
theme.bodyColor = "white";
theme.overrideThemeStyles = () => ({
  'a': {
    color: "white",
    },
  'blockquote': {
    color: "white",
  },
});

const typography = new Typography(theme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== "production") {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
