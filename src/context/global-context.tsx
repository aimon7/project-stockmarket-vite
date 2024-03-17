import { ParseResult, parse } from "papaparse";
import { FC, PropsWithChildren, createContext, useContext, useState } from "react";

import mockListings from "@/mock-responses/listing-status.json";
import { Listing } from "@/types/listing";
import { useQuery } from "@tanstack/react-query";

interface IGlobalContext {
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
}

export const GlobalContext = createContext<IGlobalContext>({} as IGlobalContext);

interface IGlobalProviderProps extends PropsWithChildren { }

export const GlobalProvider: FC<IGlobalProviderProps> = ({ children }) => {
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


    // todo: might use this later
    // const { data } = useQuery({
    //     queryKey: ['SYMBOL_SEARCH', { keywords: value }],
    //     enabled: inputValue !== ''
    // });

    return (
        <GlobalContext.Provider value={{
            autocompleteOpen,
            setAutocompleteOpen,
            searchQuery,
            setSearchQuery,
            listings: listingsData || [] as Listing[],
            isListingsPending,
            isListingsError,
            listingsError,
            selectedListing,
            setSelectedListing
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};

