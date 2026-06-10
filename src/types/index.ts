export interface TravelerPayload {
    name: string;
    birth_date: string;
    addons: string[];
}

export interface QuotePayload {
    destination: string;
    start_date: string;
    end_date: string;
    travelers: TravelerPayload[];
}

export interface Traveler {
    name: string;
    birth_date: string;
    addons: string[];
    age: number;
    subtotal: number;
    addons_allowed: string[];
}

export interface QuoteResult {
    priced_days: number;
    travelers: Traveler[];
    warnings: string[];
    discount_group_percentage: number;
    total_final: number;
}