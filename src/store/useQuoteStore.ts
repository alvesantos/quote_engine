import { create } from "zustand";
import type { QuotePayload, QuoteResult } from "@/types";
import api from "@/lib/api";

interface QuoteStore {
  step: number;
  payload: QuotePayload;
  result: QuoteResult | null;
  loading: boolean;
  error: string | null;

  nextStep: () => void;
  prevStep: () => void;
  setPayload: (payload: QuotePayload) => void;
  submitQuote: () => Promise<void>;
}

const useQuoteStore = create<QuoteStore>((set, get) => ({
  step: 1,
  result: null,
  loading: false,
  error: null,

  payload: {
    destination: "",
    start_date: "",
    end_date: "",
    travelers: [],
  },

  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setPayload: (payload) => set({ payload }),

  submitQuote: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/quotes", get().payload);
      set({ result: response.data, step: 3 });
    } catch {
      set({ error: "Erro ao buscar cotação" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useQuoteStore;