export interface TaxRate {
    year: number;
    rate: number;
}

export const NEIGHBORHOOD_TAX_RATES: Record<string, TaxRate[]> = {
    // Sample data - based on Requirement 1.3 matched to Tax Code table
    // Matching neighborhood_code to Tax Code entries
    "12345": [
        { year: 2022, rate: 6.95 },
        { year: 2023, rate: 7.10 },
        { year: 2024, rate: 7.25 }, // Prefer most recent
    ],
    "98765": [
        { year: 2023, rate: 7.95 },
        { year: 2024, rate: 8.10 },
    ],
    "55432": [
        { year: 2024, rate: 9.50 },
    ],
    "33211": [
        { year: 2022, rate: 9.80 },
        { year: 2023, rate: 10.25 },
    ],
    "77654": [
        { year: 2024, rate: 11.75 },
    ],
    "22876": [
        { year: 2024, rate: 8.75 },
    ],
};

export function getMostRecentTaxRate(neighborhoodCode: string): TaxRate | null {
    const rates = NEIGHBORHOOD_TAX_RATES[neighborhoodCode];
    if (!rates || rates.length === 0) return null;

    // Sort by year descending to pick the most recent
    return [...rates].sort((a, b) => b.year - a.year)[0];
}
