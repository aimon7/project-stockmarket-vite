import { Autocomplete, AutocompleteRenderOptionState, Box, ListItem, ListItemButton, Skeleton, TextField, Typography } from "@mui/material";
import { FC, HTMLAttributes, SyntheticEvent, forwardRef } from "react";

import { useAPIContext } from "@/context/api-context";
import { Listing } from "@/types/listing";
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";
import SearchNotFound from "./search-not-found";

const ListboxComponent = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
    const { children, style, ...other } = props;

    const { listings, searchQuery, setSelectedListing, setAutocompleteOpen } = useAPIContext();
    const data = listings?.filter((listing: Listing) => {
        const name = listing.name.toLowerCase();
        const symbol = listing.symbol.toLowerCase();
        const input = searchQuery.toLowerCase();

        return name.includes(input) || symbol.includes(input);
    });

    return (
        <Box ref={ref} {...other}>
            <Virtuoso
                style={{ height: 400, ...style }}
                data={data}
                itemContent={(index: number) => {
                    const listing = data[index];
                    const { name, symbol } = listing;

                    const partsName = parse(name, match(name, searchQuery));
                    const partsSymbol = parse(symbol, match(symbol, searchQuery));

                    return (
                        <ListItem key={symbol} sx={{ backgroundColor: "transparent" }}>
                            <ListItemButton dense onClick={() => {
                                setSelectedListing(listing);
                                setAutocompleteOpen(false);
                            }}>
                                {partsSymbol.map((part, index) => (
                                    <Box
                                        key={index}
                                        component="span"
                                        sx={{
                                            color: part.highlight ? "text.secondary" : "text.primary",
                                            backgroundColor: part.highlight ? "yellow" : undefined
                                        }}
                                    >
                                        {part.text}
                                    </Box>
                                ))}&nbsp;-&nbsp;{partsName.map((part, index) => (
                                    <Box
                                        key={index}
                                        component="span"
                                        sx={{
                                            color: part.highlight ? "text.secondary" : "text.primary",
                                            backgroundColor: part.highlight ? "yellow" : undefined,
                                        }}
                                    >
                                        {part.text}
                                    </Box>
                                ))}
                            </ListItemButton>
                        </ListItem>
                    )
                }}
            />
        </Box>
    );
});

const AutocompleteStockMarket: FC = () => {
    const { t } = useTranslation();

    const { autocompleteOpen, setAutocompleteOpen, selectedListing, setSelectedListing, searchQuery, setSearchQuery, listings, isListingsPending, isListingsError, listingsError } = useAPIContext();

    if (isListingsPending) return <Skeleton variant="rounded" width="100%" height={54} />;

    if (isListingsError) return <Typography variant="body1">{listingsError?.message}</Typography>;

    return (
        <Autocomplete<Listing>
            id="stock-market-autocomplete"
            fullWidth
            autoHighlight
            disablePortal
            disableListWrap
            openOnFocus
            open={autocompleteOpen}
            onOpen={() => setAutocompleteOpen(true)}
            onClose={() => {
                setAutocompleteOpen(false);
                setSelectedListing(null);
            }}
            options={listings}
            value={selectedListing}
            ListboxComponent={ListboxComponent}
            onInputChange={(_event: SyntheticEvent, value: string) => setSearchQuery(value)}
            noOptionsText={<SearchNotFound searchQuery={searchQuery} />}
            getOptionLabel={(option: Listing) => option.name}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, option: Listing, state: AutocompleteRenderOptionState) =>
                [props, option, state.index] as React.ReactNode
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={t("autocomplete.label")}
                    fullWidth
                    variant="outlined"
                    sx={{
                        "& .MuiFormLabel-root": {
                            color: 'text.primary'
                        }
                    }}
                    InputProps={{
                        ...params.InputProps,
                        type: 'search',
                    }}
                />)
            }
        />
    )
}

export default AutocompleteStockMarket;