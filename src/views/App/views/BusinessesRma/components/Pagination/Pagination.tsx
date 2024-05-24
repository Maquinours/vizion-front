import { getRouteApi, useNavigate } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import styles from './Pagination.module.scss';

const sizeOptions = [20, 30, 40, 50, 100, 150, 200];

const routeApi = getRouteApi('/app/businesses-rma');

type AppViewBusinessesRmaViewPaginationComponent = Readonly<{
  totalPages?: number;
  page: number;
  size: number;
}>;
export default function AppViewBusinessesRmaViewPaginationComponent({ totalPages, page, size }: AppViewBusinessesRmaViewPaginationComponent) {
  const navigate = useNavigate({ from: routeApi.id });
  return (
    <div className={styles.pagination_container}>
      <div />
      <PaginationComponent page={page} totalPages={totalPages} pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }) })} />
      <select
        defaultValue={size}
        onChange={(e) =>
          navigate({
            search: (old) => ({ ...old, size: Number(e.target.value) as 20 | 30 | 40 | 50 | 100 | 150 | 200 }),
            state: (prev) => prev,
            replace: true,
            resetScroll: false,
          })
        }
      >
        {sizeOptions.map((element, i) => (
          <option key={i} value={element}>
            {element}
          </option>
        ))}
      </select>
    </div>
  );
}
