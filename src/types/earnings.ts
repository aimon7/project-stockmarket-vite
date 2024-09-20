export type Earnings = {
    symbol: string;
    annualEarnings: AnnualEarning[];
    quarterlyEarnings: QuarterlyEarning[];
};

export type AnnualEarning = {
    fiscalDateEnding: string;
    reportedEPS: string;
};

export type QuarterlyEarning = {
    fiscalDateEnding: Date,
    reportedDate: Date,
    reportedEPS: string,
    estimatedEPS: string,
    surprise: string,
    surprisePercentage: string,
    reportTime: string	
}