export type ListType<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const getListTypeInitState = <T>(): ListType<T> => ({
  count: 0,
  next: null,
  previous: null,
  results: [],
});
