import Button from "./button";
import { Theme } from "@mui/material";

export default function ComponetsOverrides(theme: Theme) {
    return Object.assign(Button(theme));
}