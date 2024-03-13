type Sort<T> = {
  direction: 'ASC' | 'DESC';
  property: keyof T;
  ignoreCase: boolean;
  nullHandling: 'NATIVE' | 'NULLS_FIRST' | 'NULLS_LAST';
  ascending: boolean;
  descending: boolean;
};

export default Sort;
