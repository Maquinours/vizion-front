// import { getRouteApi } from '@tanstack/react-router';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import PaginationComponent from '../../../../../Pagination/Pagination';
import Page from '../../../../../../utils/types/Page';

// const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');
// const routePath = '/app/enterprises/$enterpriseId';

type AppViewEnterpriseViewContactsComponentPaginationComponentProps = Readonly<{
  data: Page<ProfileResponseDto> | undefined;
  page: number;
  setPage: (page: number) => void;
}>;
export default function AppViewEnterpriseViewContactsComponentPaginationComponent({
  data,
  page,
  setPage,
}: AppViewEnterpriseViewContactsComponentPaginationComponentProps) {
  // const { contactsPage: page } = routeApi.useSearch();

  return (
    <PaginationComponent
      page={page}
      totalPages={data?.totalPages}
      // pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, contactsPage: page }), replace: true, resetScroll: false })}
      onPageChange={setPage}
    />
  );
}
