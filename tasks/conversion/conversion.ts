const numbersMap: { [key: number]: string } = {
  1: 'I',
  4: 'IV',
  5: 'V',
  9: 'IX',
  10: 'X',
  40: 'XL',
  50: 'L',
  90: 'XC',
  100: 'C',
  400: 'CD',
  500: 'D',
  900: 'CM',
  1000: 'M',
};

export function arabicToRomanNumberConversion(num: number): string {
  if (isNaN(num)) return NaN.toString();
  if (num <= 0 || num > 4000) return 'Invalid number';

  const arabicKeys: number[] = Object.keys(numbersMap)
    .map((n) => Number(n))
    .sort((a, b) => b - a);

  let i = 0;
  let roman = '';

  while (num !== 0 && i <= arabicKeys.length) {
    const currentKey = arabicKeys[i];

    if (num >= currentKey) {
      num -= currentKey;
      roman += numbersMap[currentKey];
    } else {
      i++;
    }
  }

  return roman;
}
