import { Box, Paper, Typography } from "@mui/material";

import { useAPIContext } from "@/context/api-context";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const StockCard: FC = () => {
    const { t } = useTranslation("translation", {
        keyPrefix: "stock_card"
    });
    const { selectedListing } = useAPIContext();

    return (
        <Paper
            elevation={3}
            sx={{
                borderRadius: (theme) => theme.spacing(2),
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 2,
                p: 4,
                width: 1
            }}
        >
            <Typography variant="h5">{t('header')}</Typography>
            <Typography variant="subtitle2">{t('subtitle')}</Typography>
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width={1} pt={5}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={2}>
                    <Typography variant="h4">{selectedListing?.symbol}</Typography>
                    <Typography variant="subtitle1">{selectedListing?.name}</Typography>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={2}>
                    <Typography variant="h4">{"$"}</Typography>
                    <Typography variant="subtitle1">{ }</Typography>
                </Box>
            </Box>
        </Paper>
    )
}

export default StockCard;