import { Box, Paper, Skeleton, Typography } from "@mui/material";

import { useAPIContext } from "@/context/api-context";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const StockCard: FC = () => {
    const { t } = useTranslation("translation", {
        keyPrefix: "stock_card"
    });
    const {
        selectedListing,
        overview,
        isOverviewPending,
        isOverviewError,
        overviewError,
        globalQuote,
        isGlobalQuotePending,
        isGlobalQuoteError,
        globalQuoteError,
        earnings,
        isEarningsPending,
        isEarningsError,
        earningsError
    } = useAPIContext();

    const pe = globalQuote && earnings ? Number(globalQuote.price) / Number(earnings.annualEarnings[0].reportedEPS) : 0;

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
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={1}>
                    <Typography variant="h4">{selectedListing?.symbol}</Typography>
                    <Typography variant="subtitle1">{selectedListing?.name}</Typography>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={1}>
                    {isOverviewPending && !isOverviewError && <Skeleton variant="text" width="100%" />}
                    {overview && <Typography variant="h4">{overview?.Exchange}</Typography>}
                </Box>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width={1} pt={5}>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={1}>
                    <Typography variant="h4" sx={{ textTransform: "capitalize" }}>{t("pe")}</Typography>
                    <Typography variant="subtitle1">{t("")}</Typography>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={1}>
                    {(isEarningsPending || isGlobalQuotePending)
                        && (!isEarningsError || !isGlobalQuoteError)
                        && <Skeleton variant="text" width="100%" />}
                    {globalQuote && earnings && <Typography variant="h4">{pe.toFixed(2)}</Typography>}
                    {globalQuote && earnings && <Typography variant="caption">{earnings.annualEarnings[0].fiscalDateEnding}</Typography>}
                </Box>
            </Box>
            {isOverviewPending && !isOverviewError && <Skeleton variant="text" width="100%" />}
            {overview && <Typography variant="body1">{overview.Description}</Typography>}
            {isOverviewError && <Typography variant="body1">{overviewError?.message}</Typography>}
            {isGlobalQuoteError && <Typography variant="body1">{globalQuoteError?.message}</Typography>}
            {isEarningsError && <Typography variant="body1">{earningsError?.message}</Typography>}
        </Paper>
    )
}

export default StockCard;