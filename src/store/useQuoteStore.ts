import { create } from "zustand";
import type { QuotePayload, QuoteResult } from "@/types";
import api from "@/lib/api";
import * as z from "zod";

const quoteResultSchema = z.object({
  priced_days: z.number(),
  travelers: z.array(
    z.object({
      name: z.string(),
      birth_date: z.string(),
      addons: z.array(z.string()),
      age: z.number(),
      subtotal: z.number(),
      addons_allowed: z.array(z.string()),
    }),
  ),
  warnings: z.array(z.string()),
  discount_group_percentage: z.number(),
  total_final: z.number(),
});

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
      const parsed = quoteResultSchema.parse(response.data);
      set({ result: parsed, step: 3 });
    } catch {
      set({ error: "Erro ao buscar cotação" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useQuoteStore;