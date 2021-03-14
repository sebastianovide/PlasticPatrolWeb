export type SuggestionBasedText = {
  label: string | null;
  id: string | null;
};

export type Item = {
  quantity: number;
  category: SuggestionBasedText;
  brand: SuggestionBasedText;
  barcode?: number;
};
