import { Paper, Skeleton, Typography } from "@mui/material";

import { useAPIContext } from "@/context/api-context";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import StockCardSection from "./stock-card-section";

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

    // const pe = globalQuote && earnings ? Number(globalQuote.price) / Number(earnings.annualEarnings[0].reportedEPS) : 0;
    const pe = globalQuote && earnings ? Number(globalQuote.price) / Number(earnings.quarterlyEarnings[0].reportedEPS) : 0;

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
            {selectedListing && overview && (
                <StockCardSection header={selectedListing.symbol} subtitle={selectedListing?.name} isLoading={isOverviewPending} value={overview?.Exchange} />
            )}
            {globalQuote && (
                <StockCardSection header={t("price")} isLoading={isOverviewPending} value={t("dollars", { value: globalQuote.price })} />
            )}
            {globalQuote && earnings && (
                <StockCardSection
                    header={t("pe")}
                    headerCapitalized
                    subtitle={t("fiscal_date_ending")}
                    isLoading={isEarningsPending || isGlobalQuotePending}
                    value={pe.toFixed(2)}
                    // captionValue={earnings.annualEarnings[0].fiscalDateEnding.toDateString()}
                    captionValue={earnings.quarterlyEarnings[0].fiscalDateEnding}
                />
            )}
            {overview && (
                <StockCardSection
                    header={t("pb")}
                    headerCapitalized
                    isLoading={isOverviewPending}
                    value={overview.PriceToBookRatio}
                />
            )}
            {isOverviewPending && !isOverviewError && <Skeleton variant="text" width="100%" />}
            {overview && <Typography variant="body1">{overview.Description}</Typography>}
            {isOverviewError && <Typography variant="body1">{overviewError?.message}</Typography>}
            {isGlobalQuoteError && <Typography variant="body1">{globalQuoteError?.message}</Typography>}
            {isEarningsError && <Typography variant="body1">{earningsError?.message}</Typography>}
        </Paper>
    )
}

export default StockCard;