/**
 * Pad a number or string with leading zero to make it 2 digits
 * @param value - Number or string to pad
 * @returns Zero-padded string
 * @example
 * pad2(1) // "01"
 * pad2("1") // "01"
 * pad2(12) // "12"
 */
export const pad2 = (value: string | number): string => {
  return value.toString().padStart(2, "0");
};
