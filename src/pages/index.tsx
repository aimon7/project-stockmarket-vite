import { Box, Typography } from "@mui/material";

import AutocompleteStockMarket from "@/components/autocomplete-stock-market";
import StockCard from "@/components/stock-card";
import { useAPIContext } from "@/context/api-context";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const IndexPage: FC = () => {
    const { t } = useTranslation();

    const { selectedListing } = useAPIContext();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
            gap={2}
            height={1}
            maxWidth={1000}
            p={2}
            margin="0 auto"
        >
            <Typography variant="h1" align="center">{t('heading')}</Typography>
            <AutocompleteStockMarket />
            {selectedListing && <StockCard />}
        </Box>
    )
}

export default IndexPage;