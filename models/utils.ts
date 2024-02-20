export function mapRecord<T, S>(input: Record<string, T>, transform: (value: T) => S): Record<string, S> {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, transform(value)]));
}