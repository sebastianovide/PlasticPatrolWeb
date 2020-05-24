export type Category = {
  leafKey?: string;
  number?: number;
  brand?: string;
  error: boolean;
};

export type KeyedCategoryData = { [key: string]: CategoryData };

export type CategoryData = {
  label: string;
  children?: KeyedCategoryData;
};

export type CategoryOption = {
  key: string;
  label: string;
};
