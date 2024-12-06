import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import CardComponent from '../../../../../../components/Card/Card';
import { queries } from '../../../../../../utils/constants/queryKeys';
import styles from './OtherPersonalTasksModal.module.scss';
import AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponent from './components/Header/Header';
import AppViewDashboardViewOtherPersonalTasksModalViewPaginationComponent from './components/Pagination/Pagination';
import AppViewDashboardViewOtherPersonalTasksModalViewTableComponent from './components/Table/Table';

const routeApi = getRouteApi('/app/dashboard/other-personal-tasks/$profileId');

export default function AppViewDashboardViewOtherPersonalTasksModalView() {
  const navigate = routeApi.useNavigate();

  const { profileId } = routeApi.useParams();

  const { data: profile } = useSuspenseQuery(queries.profiles.detail(profileId));

  const { otherPersonalTaskState: state, otherPersonalTaskSize: size, otherPersonalTaskPage: page } = routeApi.useSearch();

  const {
    data: pageData,
    refetch: refetchPage,
    isRefetching: isRefetchingPage,
    isLoading: isLoadingPage,
  } = useQuery(queries.tasks.page._ctx.byStateAndProfileId(state, profileId, { page, size }));

  const { data: counts, refetch: refetchCounts, isRefetching: isRefetchingCounts } = useQuery(queries.tasks.counts._ctx.byProfileId(profileId));

  const refetch = () => {
    refetchPage();
    refetchCounts();
  };

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: true, replace: true, resetScroll: false });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <CardComponent
        title={`Charges de travail personnelles de ${profile?.firstName} ${profile?.lastName}`}
        onReload={refetch}
        isReloading={isRefetchingPage || isRefetchingCounts}
      >
        <AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponent counts={counts} />
        <AppViewDashboardViewOtherPersonalTasksModalViewTableComponent data={pageData} isLoading={isLoadingPage} profile={profile} />
        <AppViewDashboardViewOtherPersonalTasksModalViewPaginationComponent data={pageData} />
      </CardComponent>
    </ReactModal>
  );
}
