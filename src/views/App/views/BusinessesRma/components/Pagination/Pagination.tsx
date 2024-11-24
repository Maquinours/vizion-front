import { getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import styles from './Pagination.module.scss';

type SizeOption = 20 | 30 | 40 | 50 | 100 | 150 | 200 | 400;

const SIZE_OPTIONS: Array<SizeOption> = [20, 30, 40, 50, 100, 150, 200, 400];

const routeApi = getRouteApi('/app/businesses-rma');

type AppViewBusinessesRmaViewPaginationComponent = Readonly<{
  totalPages?: number;
  page: number;
  size: number;
}>;
export default function AppViewBusinessesRmaViewPaginationComponent({ totalPages, page, size }: AppViewBusinessesRmaViewPaginationComponent) {
  const navigate = routeApi.useNavigate();
  return (
    <div className={styles.pagination_container}>
      <div />
      <PaginationComponent
        page={page}
        totalPages={totalPages}
        pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, page }), replace: true, resetScroll: false })}
      />
      <select
        value={size}
        onChange={(e) =>
          navigate({
            search: (old) => ({ ...old, page: undefined, size: Number(e.target.value) as SizeOption }),
            state: (prev) => prev,
            replace: true,
            resetScroll: false,
          })
        }
      >
        {SIZE_OPTIONS.map((element, i) => (
          <option key={i} value={element}>
            {element}
          </option>
        ))}
      </select>
    </div>
  );
}
