import { arabicToRomanNumberConversion } from './conversion';

describe('arabicToRomanNumberConversion', () => {
  it('should return Roman number', async () => {
    const result = arabicToRomanNumberConversion(4);
    expect(result).toEqual('IV');
  });

  it('should return Roman number', async () => {
    const result = arabicToRomanNumberConversion(1907);
    expect(result).toEqual('MCMVII');
  });

  it('should return "Invalid number" if number is negative', async () => {
    const result = arabicToRomanNumberConversion(-1);
    expect(result).toEqual('Invalid number');
  });

  it('should return "Invalid number" if number is over 4000', async () => {
    const result = arabicToRomanNumberConversion(4001);
    expect(result).toEqual('Invalid number');
  });
});
