import { Box, Skeleton, Typography } from "@mui/material";
import { FC } from "react";

interface IStockCardSectionProps {
    header: string;
    headerCapitalized?: boolean;
    subtitle?: string;
    isLoading: boolean;
    value: string;
    captionValue?: string;
}

const StockCardSection: FC<IStockCardSectionProps> = ({ header, headerCapitalized = false, subtitle, isLoading, value, captionValue }) => (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" width={1} pt={5}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={1}>
            <Typography variant="h4" sx={{ textTransform: headerCapitalized ? "capitalize" : undefined }}>{header}</Typography>
            {subtitle && (<Typography variant="subtitle1">{subtitle}</Typography>)}
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" gap={1}>
            {isLoading && <Skeleton variant="text" width="100%" />}
            {!isLoading && <Typography variant="h4">{value}</Typography>}
            {!isLoading && captionValue && <Typography variant="caption">{captionValue}</Typography>}
        </Box>
    </Box>
)

export default StockCardSection;