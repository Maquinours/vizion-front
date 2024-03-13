import ReactModal from 'react-modal';
import styles from './OtherPersonalTasksModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import CardComponent from '../../../../../../components/Card/Card';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import { getPaginatedTasksByStateAndProfileId } from '../../../../../../utils/api/task';
import { profileQueryKeys } from '../../../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../../../utils/api/profile';
import AppViewDashboardViewOtherPersonalTasksModalViewPaginationComponent from './components/Pagination/Pagination';
import AppViewDashboardViewOtherPersonalTasksModalViewTableComponent from './components/Table/Table';
import AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponent from './components/Header/Header';

const Route = getRouteApi('/app/dashboard/other-personal-tasks/$profileId');

export default function AppViewDashboardViewOtherPersonalTasksModalView() {
  const navigate = useNavigate();

  const { profileId } = Route.useParams();

  const { data: profile } = useSuspenseQuery({
    queryKey: profileQueryKeys.detailById(profileId),
    queryFn: () => getProfileById(profileId),
  });

  const { otherPersonalTaskState: state, otherPersonalTaskSize: size, otherPersonalTaskPage: page } = Route.useSearch();

  const { data, refetch, isRefetching, isLoading } = useQuery({
    queryKey: taskQueryKeys.pageByStateAndProfileId(state, profileId, page, size),
    queryFn: () => getPaginatedTasksByStateAndProfileId(state, profileId, page, size),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <CardComponent
        title={`Charges de travail personnelles de ${profile?.firstName} ${profile?.lastName}`}
        onReload={() => refetch()}
        isReloading={isRefetching}
      >
        <AppViewDashboardViewOtherPersonalTasksModalViewHeaderComponent />
        <AppViewDashboardViewOtherPersonalTasksModalViewTableComponent data={data} isLoading={isLoading} />
        <AppViewDashboardViewOtherPersonalTasksModalViewPaginationComponent data={data} />
      </CardComponent>
    </ReactModal>
  );
}
