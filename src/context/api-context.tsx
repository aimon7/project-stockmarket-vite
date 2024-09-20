import { ParseResult, parse } from "papaparse";
import { FC, PropsWithChildren, createContext, useContext, useState } from "react";

import mockListings from "@/mock-responses/listing-status.json";
import { Earnings } from "@/types/earnings";
import { GlobalQuote } from "@/types/global-quote";
import { Listing } from "@/types/listing";
import { Overview } from "@/types/overview";
import { useQuery } from "@tanstack/react-query";

interface IAPIContext {
    autocompleteOpen: boolean;
    setAutocompleteOpen: (value: boolean) => void;
    searchQuery: string;
    setSearchQuery: (value: string) => void;

    listings: Listing[];
    isListingsPending: boolean;
    isListingsError: boolean;
    listingsError: Error | null;

    selectedListing: Listing | null;
    setSelectedListing: (value: Listing | null) => void;

    overview: Overview | undefined;
    isOverviewPending: boolean;
    isOverviewError: boolean;
    overviewError: Error | null;

    globalQuote: GlobalQuote | undefined;
    isGlobalQuotePending: boolean;
    isGlobalQuoteError: boolean;
    globalQuoteError: Error | null;

    earnings: Earnings | undefined;
    isEarningsPending: boolean;
    isEarningsError: boolean;
    earningsError: Error | null;
}

export const APIContext = createContext<IAPIContext>({} as IAPIContext);

interface IAPIProviderProps extends PropsWithChildren { }

export const APIProvider: FC<IAPIProviderProps> = ({ children }) => {
    const [autocompleteOpen, setAutocompleteOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    const { data: listingsData, isPending: isListingsPending, isError: isListingsError, error: listingsError } = useQuery<Listing[]>({
        queryKey: ['LISTING_STATUS'],
        staleTime: 1000 * 60 * 60 * 24, // 24 hours stale time
        queryFn: async ({ queryKey: [key] }) => {
            if (typeof key !== 'string') {
                throw new Error('Invalid QueryKey');
            }

            if (import.meta.env.VITE_NODE_ENV === 'development') {
                return mockListings.filter((listing: Listing) => listing.name !== "" && listing.symbol !== "") as Listing[] || [];
            }

            const url = `${import.meta.env.VITE_BASE_URL}${key}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "text/csv"
                },
                redirect: 'follow'
            });

            if (!response.ok) {
                console.error(response);
                throw new Error('Network response was not ok');
            }

            const result = await response.text();
            const csv: ParseResult<Listing> = parse(result, { header: true, delimiter: ',' });

            return csv.data.filter((listing: Listing) => listing.name !== "" && listing.symbol !== "")
        }
    });


    const { data: overviewData, isPending: isOverviewPending, isError: isOverviewError, error: overviewError } = useQuery<Overview>({
        queryKey: ['OVERVIEW', { symbol: selectedListing?.symbol }],
        enabled: selectedListing !== null,
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}OVERVIEW&symbol=${selectedListing?.symbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`, {
                method: "GET",
            });

            return response.json() as Promise<Overview>;
        }
    });

    const { data: globalQuoteData, isPending: isGlobalQuotePending, isError: isGlobalQuoteError, error: globalQuoteError } = useQuery<GlobalQuote>({
        queryKey: ['GLOBAL_QUOTE', { symbol: selectedListing?.symbol }],
        enabled: selectedListing !== null,
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}GLOBAL_QUOTE&symbol=${selectedListing?.symbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`, {
                method: "GET",
            });

            const data = await response.json();
            const globalQuote = data['Global Quote'];

            // Transform the keys
            const transformedGlobalQuote = {
                symbol: globalQuote['01. symbol'],
                open: globalQuote['02. open'],
                high: globalQuote['03. high'],
                low: globalQuote['04. low'],
                price: globalQuote['05. price'],
                volume: globalQuote['06. volume'],
                latestTradingDay: globalQuote['07. latest trading day'],
                previousClose: globalQuote['08. previous close'],
                change: globalQuote['09. change'],
                changePercent: globalQuote['10. change percent']
            };
        
            return transformedGlobalQuote;
        }
    });

    const { data: earningsData, isPending: isEarningsPending, isError: isEarningsError, error: earningsError } = useQuery<Earnings>({
        queryKey: ['EARNINGS', { symbol: selectedListing?.symbol }],
        enabled: selectedListing !== null,
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}EARNINGS&symbol=${selectedListing?.symbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`, {
                method: "GET",
            });

            return response.json();
        }
    });


    return (
        <APIContext.Provider value={{
            autocompleteOpen,
            setAutocompleteOpen,
            searchQuery,
            setSearchQuery,
            listings: listingsData || [] as Listing[],
            isListingsPending,
            isListingsError,
            listingsError,
            selectedListing,
            setSelectedListing,
            overview: overviewData,
            isOverviewPending,
            isOverviewError,
            overviewError,
            globalQuote: globalQuoteData,
            isGlobalQuotePending,
            isGlobalQuoteError,
            globalQuoteError,
            earnings: earningsData,
            isEarningsPending,
            isEarningsError,
            earningsError
        }}>
            {children}
        </APIContext.Provider>
    );
};

export const useAPIContext = () => {
    return useContext(APIContext);
};

