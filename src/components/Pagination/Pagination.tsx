import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styles from './Pagination.module.scss';
import usePagination from '@mui/material/usePagination/usePagination';
import classNames from 'classnames';
import { Link, LinkProps } from '@tanstack/react-router';

type PaginationComponentProps = Readonly<{
  page: number;
  totalPages: number | undefined;
  pageLink?: (page: number) => LinkProps;
  onPageChange?: (page: number) => void;
}>;

export default function PaginationComponent({ page, totalPages = 0, pageLink, onPageChange }: PaginationComponentProps) {
  const currentPage = page + 1;

  const { items } = usePagination({
    count: totalPages,
    page: currentPage,
  });

  return (
    <nav>
      <ul className={styles.container}>
        {items.map(({ page, type, selected, disabled }, index) => {
          let children = null;

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = '…';
          } else if (type === 'page') {
            children = pageLink ? (
              <Link {...pageLink(page! - 1)}>{page}</Link>
            ) : (
              onPageChange !== undefined && <button onClick={() => onPageChange(page! - 1)}>{page}</button>
            );
          } else if (type === 'previous') {
            children = pageLink ? (
              <Link {...pageLink(page! - 1)}>
                <IoIosArrowBack />
              </Link>
            ) : (
              onPageChange !== undefined && (
                <button onClick={() => onPageChange(page! - 1)}>
                  <IoIosArrowBack />
                </button>
              )
            );
          } else if (type === 'next') {
            children = pageLink ? (
              <Link {...pageLink(page! - 1)}>
                <IoIosArrowForward />
              </Link>
            ) : (
              onPageChange !== undefined && (
                <button onClick={() => onPageChange(page! - 1)}>
                  <IoIosArrowForward />
                </button>
              )
            );
          }

          return (
            <li
              className={classNames(styles.item, {
                [styles.selected]: selected,
                [styles.disabled]: disabled || type === 'start-ellipsis' || type === 'end-ellipsis',
              })}
              key={index}
            >
              {children}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
