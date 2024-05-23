import { getRouteApi } from '@tanstack/react-router';
import PaginationComponent from '../../../../../../../../components/Pagination/Pagination';
import Page from '../../../../../../../../utils/types/Page';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

type AppViewEnterpriseViewContactsComponentPaginationComponentProps = Readonly<{
  data: Page<ProfileResponseDto> | undefined;
}>;
export default function AppViewEnterpriseViewContactsComponentPaginationComponent({ data }: AppViewEnterpriseViewContactsComponentPaginationComponentProps) {
  const { contactsPage: page } = Route.useSearch();

  return (
    <PaginationComponent
      page={page}
      totalPages={data?.totalPages}
      pageLink={(page) => ({ from: Route.id, search: (old) => ({ ...old, contactsPage: page }), replace: true })}
    />
  );
}
