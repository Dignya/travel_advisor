
import { create } from 'zustand';

interface MatchResult {
    destinationId: string;
    score: number;
    matchReason: string;
    name?: string;
    city?: string;
    country?: string;
}

interface TripState {
    userQuery: string;
    isAnalyzing: boolean;
    recommendations: MatchResult[];

    // Actions
    setUserQuery: (query: string) => void;
    setAnalyzeStart: () => void;
    setAnalyzeComplete: (results: MatchResult[]) => void;
    reset: () => void;
}

export const useTripStore = create<TripState>((set) => ({
    userQuery: '',
    isAnalyzing: false,
    recommendations: [],

    setUserQuery: (query: string) => set({ userQuery: query }),
    setAnalyzeStart: () => set({ isAnalyzing: true }),
    setAnalyzeComplete: (results: MatchResult[]) => set({ isAnalyzing: false, recommendations: results }),
    reset: () => set({ userQuery: '', isAnalyzing: false, recommendations: [] }),
}));
