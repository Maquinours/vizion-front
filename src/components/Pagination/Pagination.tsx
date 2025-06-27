import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import styles from './Pagination.module.scss';
import usePagination from '@mui/material/usePagination';
import classNames from 'classnames';
import { Link, LinkProps, useNavigate } from '@tanstack/react-router';
import PaginationComponentEllipsisComponent from './components/Ellipsis/Ellipsis';
import AmountFormat from '../AmountFormat/AmountFormat';

type PaginationComponentProps = Readonly<{
  page: number;
  totalPages: number | undefined;
  pageLink?: (page: number) => LinkProps;
  onPageChange?: (page: number) => void;
}>;

export default function PaginationComponent({ page, totalPages = 0, pageLink, onPageChange }: PaginationComponentProps) {
  const navigate = useNavigate();

  const currentPage = page + 1;

  const { items } = usePagination({
    count: totalPages,
    page: currentPage,
    siblingCount: 2,
  });

  const changePage = (page: number) => {
    if (onPageChange) onPageChange(page);
    else if (pageLink) {
      const link = pageLink(page);
      navigate({ to: link.to, params: link.params, search: link.search, state: link.state, replace: link.replace, resetScroll: link.resetScroll });
    }
  };

  if (totalPages === 0) return null;
  return (
    <nav className={styles.nav}>
      <ul className={styles.container}>
        {items.map(({ page, type, selected, disabled }, index) => {
          let children = null;

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = <PaginationComponentEllipsisComponent totalPages={totalPages} changePage={changePage} />;
          } else if (type === 'page') {
            children = pageLink ? (
              <Link {...pageLink(page! - 1)}>
                <AmountFormat value={page} displayType="text" />
              </Link>
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
                [styles.disabled]: disabled,
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
