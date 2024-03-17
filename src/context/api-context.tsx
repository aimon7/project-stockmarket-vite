import { ParseResult, parse } from "papaparse";
import { FC, PropsWithChildren, createContext, useContext, useState } from "react";

import mockListings from "@/mock-responses/listing-status.json";
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
}

export const APIContext = createContext<IAPIContext>({} as IAPIContext);

interface IAPIProviderProps extends PropsWithChildren { }

export const APIProvider: FC<IAPIProviderProps> = ({ children }) => {
    const [autocompleteOpen, setAutocompleteOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

    const { data: listingsData, isPending: isListingsPending, isError: isListingsError, error: listingsError } = useQuery({
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


    const { data: overviewData, isPending: isOverviewPending, isError: isOverviewError, error: overviewError } = useQuery({
        queryKey: ['OVERVIEW', { symbol: selectedListing?.symbol }],
        enabled: selectedListing !== null,
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}OVERVIEW&symbol=${selectedListing?.symbol}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`, {
                method: "GET",
            });

            return response.json() as Promise<Overview>;
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
            overviewError
        }}>
            {children}
        </APIContext.Provider>
    );
};

export const useAPIContext = () => {
    return useContext(APIContext);
};

