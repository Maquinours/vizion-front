import { useQuery } from '@tanstack/react-query';
// import { getRouteApi } from '@tanstack/react-router';
import styles from './Contacts.module.scss';
import AppViewEnterpriseViewContactsComponentButtonsComponent from './components/Buttons/Buttons';
import AppViewEnterpriseViewContactsComponentPaginationComponent from './components/Pagination/Pagination';
import AppViewEnterpriseViewContactsComponentSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewEnterpriseViewContactsComponentTableComponent from './components/Table/Table';
import { queries } from '../../../../utils/constants/queryKeys';
import CardComponent from '../../../Card/Card';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import { useState } from 'react';
import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';

const size = 5;

type EnterpriseModalComponentContactsComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  defaultContactsSearch: string | undefined;
  onImportContactsClick: () => void;
  onCreateContactClick: () => void;
  onCreateContactBusinessClick: (contact: ProfileResponseDto) => void;
  onSendEmailToContactClick: (contact: ProfileResponseDto) => void;
  onDeleteContactClick: (contact: ProfileResponseDto) => void;
  onUpdateContactClick: (contact: ProfileResponseDto) => void;
  onUpdateContactPasswordClick: (contact: ProfileResponseDto) => void;
  onContactEmailHistoryClick: (contact: ProfileResponseDto) => void;
}>;
export default function EnterpriseModalComponentContactsComponent({
  enterprise,
  defaultContactsSearch,
  onImportContactsClick,
  onCreateContactClick,
  onCreateContactBusinessClick,
  onSendEmailToContactClick,
  onDeleteContactClick,
  onUpdateContactClick,
  onUpdateContactPasswordClick,
  onContactEmailHistoryClick,
}: EnterpriseModalComponentContactsComponentProps) {
  // const { contactsSearch: search, contactsPage: page } = routeApi.useSearch();
  // const { enterpriseId } = routeApi.useParams();

  const [search, setSearch] = useState<string | undefined>(defaultContactsSearch);
  const [page, setPage] = useState(0);

  const { data, refetch } = useQuery(queries.profiles.page._ctx.byEnterpriseIdAndSearch(enterprise.id, search, { page, size }));

  return (
    <CardComponent title="Contacts">
      <div className={styles.container}>
        <div className={styles.header}>
          <AppViewEnterpriseViewContactsComponentButtonsComponent
            refetch={refetch}
            onImportContactsClick={onImportContactsClick}
            onCreateContactClick={onCreateContactClick}
          />
          <AppViewEnterpriseViewContactsComponentSearchSectionComponent search={search} setSearch={setSearch} setPage={setPage} />
        </div>
        <div className={styles.body}>
          <AppViewEnterpriseViewContactsComponentTableComponent
            data={data?.content}
            onCreateContactBusinessClick={onCreateContactBusinessClick}
            onSendEmailToContactClick={onSendEmailToContactClick}
            onDeleteContactClick={onDeleteContactClick}
            onUpdateContactClick={onUpdateContactClick}
            onUpdateContactPasswordClick={onUpdateContactPasswordClick}
            onContactEmailHistoryClick={onContactEmailHistoryClick}
          />
          <AppViewEnterpriseViewContactsComponentPaginationComponent data={data} page={page} setPage={setPage} />
        </div>
      </div>
    </CardComponent>
  );
}
