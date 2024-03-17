import { PaletteMode, PaletteOptions, createTheme } from "@mui/material";

import componetsOverrides from "./overrides";
import { getPalette } from "./palette-config";
import typography from "./typography-config";

const SPACING_UNIT = 4;

export const DRAWER_WIDTH: number = 240;

export const getTheme = (selectedTheme: PaletteMode) => {
    const palette: PaletteOptions = selectedTheme === 'dark' ? getPalette('dark') : getPalette('light');

    const theme = createTheme({
        palette,
        typography,
        spacing: SPACING_UNIT,
    });

    theme.components = {
        ...componetsOverrides(theme)
    };

    return theme;
}