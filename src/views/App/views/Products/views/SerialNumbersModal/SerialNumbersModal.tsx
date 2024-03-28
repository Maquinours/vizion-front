import ReactModal from 'react-modal';
import AppViewProductsViewSerialNumbersModalViewSearchSectionComponent from './components/SearchSection/SearchSection';
import { useQuery } from '@tanstack/react-query';
import { productSerialNumberQueryKeys } from '../../../../../../utils/constants/queryKeys/productSerialNumber';
import { Link, Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import { getProductSerialNumbersPage, getProductSerialNumbersPageWithSearch } from '../../../../../../utils/api/productSerialNumber';
import AppViewProductsViewSerialNumbersModalViewTableComponent from './components/Table/Table';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import styles from './SerialNumbersModal.module.scss';

const routeApi = getRouteApi('/app/products/serial-numbers');

const size = 20;

export default function AppViewProductsViewSerialNumbersModalView() {
  const navigate = useNavigate();

  const { serialNumbersSearch: search, serialNumbersPage: page } = routeApi.useSearch();

  const { data, isLoading } = useQuery({
    queryKey: productSerialNumberQueryKeys.pageWithSearch(search, page, 20),
    queryFn: () => (search ? getProductSerialNumbersPageWithSearch(search, page, size) : getProductSerialNumbersPage(page, size)),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => ({ ...old, serialNumbersPage: undefined, serialNumbersSearch: undefined }) });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} overlayClassName="Overlay" className={styles.modal}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.buttons_container}>
              <AppViewProductsViewSerialNumbersModalViewSearchSectionComponent />
              <div className={styles.add_button}>
                <Link from={routeApi.id} to="./create" search={(old) => old} className="btn btn-secondary">
                  Ajouter
                </Link>
              </div>
            </div>

            <AppViewProductsViewSerialNumbersModalViewTableComponent data={data?.content} isLoading={isLoading} />
            <PaginationComponent
              page={page}
              totalPages={data?.totalPages}
              pageLink={(page) => ({ from: routeApi.id, search: (old) => ({ ...old, serialNumbersPage: page }), params: (old) => old })}
            />
          </div>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
