import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import AddressResponseDto from '../../../../../../../../utils/types/AddressResponseDto';
import Page from '../../../../../../../../utils/types/Page';
import styles from './Pagination.module.scss';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/address-book');
const routePath = '/app/enterprises/$enterpriseId/address-book';

type AppViewEnterpriseViewAddressBookModalViewPaginationComponentProps = Readonly<{
  addresses: Page<AddressResponseDto> | undefined;
}>;
export default function AppViewEnterpriseViewAddressBookModalViewPaginationComponent({
  addresses,
}: AppViewEnterpriseViewAddressBookModalViewPaginationComponentProps) {
  const { page } = routeApi.useSearch();

  return (
    <div className={styles.pagination}>
      <PaginationComponent
        page={page}
        totalPages={addresses?.totalPages}
        pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, page }), replace: true, resetScroll: false })}
      />
    </div>
  );
}
