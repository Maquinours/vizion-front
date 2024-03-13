import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styles from './Pagination.module.scss';
import Page from '../../utils/types/Page';
import usePagination from '@mui/material/usePagination/usePagination';
import classNames from 'classnames';

type PaginationComponentProps<T> = Readonly<{
  page: number;
  pages: Page<T> | undefined;
  onPageChange: (page: number) => void;
}>;

export default function PaginationComponent<T>({ page, pages, onPageChange }: PaginationComponentProps<T>) {
  const currentPage = page + 1;

  const { items } = usePagination({
    count: pages?.totalPages ?? 0,
    page: currentPage,
    onChange: (_e, page) => onPageChange(page - 1),
  });

  return (
    <nav>
      <ul className={styles.container}>
        {items.map(({ page, type, selected, disabled, ...item }, index) => {
          let children = null;

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = '…';
          } else if (type === 'page') {
            children = (
              <button type="button" {...item}>
                {page}
              </button>
            );
          } else if (type === 'previous') {
            children = (
              <button type="button" {...item}>
                <IoIosArrowBack />
              </button>
            );
          } else if (type === 'next') {
            children = (
              <button type="button" {...item}>
                <IoIosArrowForward />
              </button>
            );
          }

          return (
            <li className={classNames(styles.item, { [styles.selected]: selected, [styles.disabled]: disabled })} key={index}>
              {children}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
