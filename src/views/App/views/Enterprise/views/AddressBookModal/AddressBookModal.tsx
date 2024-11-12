import { useQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './AddressBookModal.module.scss';
import AppViewEnterpriseViewAddressBookModalViewAddressesComponent from './components/Addresses/Addresses';
import AppViewEnterpriseViewAddressBookModalViewHeaderComponent from './components/Header/Header';
import AppViewEnterpriseViewAddressBookModalViewPaginationComponent from './components/Pagination/Pagination';
import AppViewEnterpriseViewAddressBookModalViewSearchSectionComponent from './components/SearchSection/SearchSection';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/address-book');

const size = 9;

export default function AppViewEnterpriseViewAddressBookModalView() {
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();
  const { search, page } = routeApi.useSearch();

  const { data, isLoading } = useQuery(queries.address.page._ctx.searchByEnterpriseId({ enterpriseId, searchText: search }, { page, size }));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_content}>
          <AppViewEnterpriseViewAddressBookModalViewHeaderComponent />
          <div className={styles.modal_body}>
            <AppViewEnterpriseViewAddressBookModalViewSearchSectionComponent />
            <AppViewEnterpriseViewAddressBookModalViewAddressesComponent isLoading={isLoading} addresses={data?.content} />
          </div>
          <AppViewEnterpriseViewAddressBookModalViewPaginationComponent addresses={data} />
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
