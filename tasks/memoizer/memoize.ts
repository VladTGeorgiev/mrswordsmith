type FunctionToMemoize = (...args: any[]) => any;

export function memoize(fn: FunctionToMemoize): FunctionToMemoize {
  const cache: { [key: string]: any } = {};

  return (...args: any[]) => {
    const key = JSON.stringify(args);

    if (!cache[key]) {
      cache[key] = fn(...args);
    }

    return cache[key];
  };
}
