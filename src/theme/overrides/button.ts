import { Theme } from "@mui/material";

export default function Button(theme: Theme) {
    return {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none' as const,
                    borderRadius: theme.spacing(2)
                }
            }
        }
    }
}