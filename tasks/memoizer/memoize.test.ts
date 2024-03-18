import { memoize } from './memoize';

describe('memoize', () => {
  const slowFn = (n: number) => {
    for (let i = 0; i < 100_000_000; i++) {}
    return n * n;
  };

  const mockSlowFn = jest.fn(slowFn);

  it('should return a function', () => {
    const result = memoize(mockSlowFn);

    expect(typeof result).toBe('function');
  });

  it('should return memoized result', async () => {
    const memoized = memoize(slowFn);
    const res = memoized(7);

    expect(res).toEqual(49);
  });

  it('should return the same result as the un-memoized function', () => {
    const unMemoized = slowFn(7);

    const memoized = memoize(slowFn);
    const res = memoized(7);

    expect(unMemoized).toBe(res);
  });

  it('should call the un-memoized function once per unique argument set', () => {
    const memoizedAdd = memoize(mockSlowFn);
    memoizedAdd(1, 2);
    memoizedAdd(1, 2);
    memoizedAdd(2, 3);

    expect(mockSlowFn).toHaveBeenCalledTimes(2);
  });
});
