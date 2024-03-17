import { Box, Typography } from "@mui/material";

import AutocompleteStockMarket from "@/components/autocomplete-stock-market";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const IndexPage: FC = () => {
    const { t } = useTranslation();

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
        </Box>
    )
}

export default IndexPage;