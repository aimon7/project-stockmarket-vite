import { PaletteMode, PaletteOptions } from "@mui/material";

export const PRIMARY_COLOR = '#3742FA';
export const SECONDARY_COLOR = "#F4F5F6";
export const FONT_COLOR_DARK = "#FFFFFF";
export const FONT_COLOR_LIGHT = "#000000";
export const BACKGROUND_COLOR_DARK = "#2B2E4A";
export const BACKGROUND_COLOR_LIGHT = "#FFFFFF"

export const getPalette = (mode: PaletteMode): PaletteOptions => ({
    mode,
    primary: {
        main: PRIMARY_COLOR,
    },
    secondary: {
        main: SECONDARY_COLOR,
    },
    text: {
        primary: mode === 'dark' ? FONT_COLOR_DARK : FONT_COLOR_LIGHT,
        secondary: mode === 'dark' ? FONT_COLOR_LIGHT : FONT_COLOR_DARK,
    },
    background: {
        default: mode === 'dark' ? BACKGROUND_COLOR_DARK : BACKGROUND_COLOR_LIGHT
    }
})