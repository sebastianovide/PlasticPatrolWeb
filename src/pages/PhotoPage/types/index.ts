export type Type = {
  leafKey: string | null;
  label: string | null;
};

export type Item = {
  quantity: number;
  type: Type;
  brand?: string;
};
