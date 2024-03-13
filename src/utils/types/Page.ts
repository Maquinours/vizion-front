import Sort from './Sort';

type Page<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort<T>[];
  first: boolean;
  last: boolean;
  numberOfElements: number;
};

export default Page;
