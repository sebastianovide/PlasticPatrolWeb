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

export type CategoryJson = { [key: string]: { label: string; synonyms?: string[] | undefined } };