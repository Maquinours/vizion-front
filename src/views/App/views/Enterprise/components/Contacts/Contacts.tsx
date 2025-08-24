import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './Contacts.module.scss';
import AppViewEnterpriseViewContactsComponentButtonsComponent from './components/Buttons/Buttons';
import AppViewEnterpriseViewContactsComponentPaginationComponent from './components/Pagination/Pagination';
import AppViewEnterpriseViewContactsComponentSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewEnterpriseViewContactsComponentTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');

const size = 5;

export default function AppViewEnterpriseViewContactsComponent() {
  const { contactsSearch: search, contactsPage: page } = routeApi.useSearch();
  const { enterpriseId } = routeApi.useParams();

  const { data, refetch, isLoading } = useQuery(queries.profiles.page._ctx.byEnterpriseIdAndSearch(enterpriseId, search, { page, size }));

  return (
    <CardComponent title="Contacts">
      <div className={styles.container}>
        <div className={styles.header}>
          <AppViewEnterpriseViewContactsComponentButtonsComponent refetch={refetch} />
          <AppViewEnterpriseViewContactsComponentSearchSectionComponent />
        </div>
        <div className={styles.body}>
          <AppViewEnterpriseViewContactsComponentTableComponent data={data?.content} isLoading={isLoading} />
          <AppViewEnterpriseViewContactsComponentPaginationComponent data={data} />
        </div>
      </div>
    </CardComponent>
  );
}
