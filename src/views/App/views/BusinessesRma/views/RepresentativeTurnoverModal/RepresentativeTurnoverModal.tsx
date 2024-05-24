import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import AppViewBusinessesRmaViewRepresentativeTurnoverModalViewFormSectionComponent from './components/FormSection/FormSection';
import AppViewBusinessesRmaViewRepresentativeTurnoverModalViewRecapSectionComponent from './components/RecapSection/RecapSection';
import AppViewBusinessesRmaViewRepresentativeTurnoverModalViewTableComponent from './components/Table/Table';
import styles from './RepresentativeTurnoverModal.module.scss';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import ReactModal from 'react-modal';

const routeApi = getRouteApi('/app/businesses-rma/representative-turnover');

export default function AppViewBusinessesRmaViewRepresentativeTurnoverModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { year, month } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: enterprise } = useSuspenseQuery(queries.enterprise.detail(user.profile.enterprise!.id));

  const { data, isLoading } = useQuery(
    queries['sales-vva'].list._ctx.byDepartmentCodesYearAndMonth({ departmentCodes: enterprise.departments?.map((d) => d.code) ?? [], year, month }),
  );

  const onClose = () => {
    navigate({ to: '..', search: (old) => ({ ...old, year: undefined, month: undefined }), state: (prev) => prev, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} overlayClassName="Overlay" className={styles.modal} onRequestClose={onClose}>
      <div className={styles.container}>
        <div className={styles.content}>
          <AppViewBusinessesRmaViewRepresentativeTurnoverModalViewFormSectionComponent />
          <AppViewBusinessesRmaViewRepresentativeTurnoverModalViewTableComponent data={data} isLoading={isLoading} />
          <AppViewBusinessesRmaViewRepresentativeTurnoverModalViewRecapSectionComponent data={data} />
        </div>
      </div>
    </ReactModal>
  );
}
