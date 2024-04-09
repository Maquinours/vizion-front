import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './Contacts.module.scss';
import AppViewEnterpriseViewContactsComponentButtonsComponent from './components/Buttons/Buttons';
import AppViewEnterpriseViewContactsComponentPaginationComponent from './components/Pagination/Pagination';
import AppViewEnterpriseViewContactsComponentSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewEnterpriseViewContactsComponentTableComponent from './components/Table/Table';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

const size = 5;

export default function AppViewEnterpriseViewContactsComponent() {
  const { contactsSearch: search, contactsPage: page } = Route.useSearch();

  const { enterpriseId } = Route.useParams();

  const { data, refetch } = useQuery(queries.profiles.page._ctx.byEnterpriseIdAndSearch(enterpriseId, search, { page, size }));

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
