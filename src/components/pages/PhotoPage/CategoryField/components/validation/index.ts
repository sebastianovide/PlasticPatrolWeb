export const validateString = (value: string): boolean =>
  !!(value && value.trim().length > 0);

export const validateIsPositiveNumber = (value: string | number) =>
  Number.isInteger(Number(value)) && Number(value) > 0;
