import { useQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import { searchPaginatedAddressesByEnterpriseId } from '../../../../../../utils/api/address';
import { addressQueryKeys } from '../../../../../../utils/constants/queryKeys/address';
import styles from './AddressBookModal.module.scss';
import AppViewEnterpriseViewAddressBookModalViewHeaderComponent from './components/Header/Header';
import AppViewEnterpriseViewAddressBookModalViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewEnterpriseViewAddressBookModalViewAddressesComponent from './components/Addresses/Addresses';
import AppViewEnterpriseViewAddressBookModalViewPaginationComponent from './components/Pagination/Pagination';

const Route = getRouteApi('/app/enterprises/$enterpriseId/address-book');

const size = 9;

export default function AppViewEnterpriseViewAddressBookModalView() {
  const navigate = useNavigate();

  const { enterpriseId } = Route.useParams();
  const { search, page } = Route.useSearch();

  const searchValue = search ?? '';
  const { data: addresses, isLoading } = useQuery({
    queryKey: addressQueryKeys.pageByEnterpriseIdWithSearch(enterpriseId, searchValue, page, size),
    queryFn: () => searchPaginatedAddressesByEnterpriseId(enterpriseId, searchValue, page, size),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '..', search: (old) => old });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_content}>
          <AppViewEnterpriseViewAddressBookModalViewHeaderComponent />
          <div className={styles.modal_body}>
            <AppViewEnterpriseViewAddressBookModalViewSearchSectionComponent />
            <AppViewEnterpriseViewAddressBookModalViewAddressesComponent isLoading={isLoading} addresses={addresses?.content} />
          </div>
          <AppViewEnterpriseViewAddressBookModalViewPaginationComponent addresses={addresses} />
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
