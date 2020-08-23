export type SuggestionBasedText = {
  leafKey: string | null;
  label: string | null;
};

export type Item = {
  quantity: number;
  type: SuggestionBasedText;
  brand: string;
  barcode?: number;
};
