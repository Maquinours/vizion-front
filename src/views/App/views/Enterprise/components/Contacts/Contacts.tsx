import { useQuery } from '@tanstack/react-query';
import CardComponent from '../../../../../../components/Card/Card';
import styles from './Contacts.module.scss';
import AppViewEnterpriseViewContactsComponentButtonsComponent from './components/Buttons/Buttons';
import { profileQueryKeys } from '../../../../../../utils/constants/queryKeys/profile';
import { getRouteApi } from '@tanstack/react-router';
import { getProfilesPageByEnterpriseId, getProfilesPageByEnterpriseIdAndSearch } from '../../../../../../utils/api/profile';
import AppViewEnterpriseViewContactsComponentTableComponent from './components/Table/Table';
import AppViewEnterpriseViewContactsComponentPaginationComponent from './components/Pagination/Pagination';
import AppViewEnterpriseViewContactsComponentSearchSectionComponent from './components/SearchSection/SearchSection';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

export default function AppViewEnterpriseViewContactsComponent() {
  const { contactsSearch: search, contactsPage: page } = Route.useSearch();

  const { enterpriseId } = Route.useParams();

  const { data, refetch } = useQuery({
    queryKey: profileQueryKeys.pageByEnterpriseIdAndSearch(enterpriseId, search, page, 5),
    queryFn: () => (search ? getProfilesPageByEnterpriseIdAndSearch(enterpriseId, search, page, 5) : getProfilesPageByEnterpriseId(enterpriseId, page, 5)),
  });

  return (
    <CardComponent title="Contacts">
      <div className={styles.container}>
        <div className={styles.header}>
          <AppViewEnterpriseViewContactsComponentButtonsComponent refetch={refetch} />
          <AppViewEnterpriseViewContactsComponentSearchSectionComponent />
        </div>
        <div className={styles.body}>
          <AppViewEnterpriseViewContactsComponentTableComponent data={data?.content} />
          <AppViewEnterpriseViewContactsComponentPaginationComponent data={data} />
        </div>
      </div>
    </CardComponent>
  );
}
