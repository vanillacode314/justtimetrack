export function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}

export function round(input: number, precision: number = 2): number {
  const p = Math.pow(10, precision);
  return Math.round(input * p) / p;
}

export function formatSeconds(inputSeconds: number) {
  const hours = Math.floor(inputSeconds / 3600);
  const minutes = Math.floor((inputSeconds - hours * 3600) / 60);
  const seconds = Math.floor(inputSeconds - hours * 3600 - minutes * 60);
  return {
    hours,
    minutes,
    seconds,
  };
}
