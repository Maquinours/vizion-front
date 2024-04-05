import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { gedQueryKeys } from '../../../../../../utils/constants/queryKeys/ged';
import { getDirectoryByTypeAndIdOnS3 } from '../../../../../../utils/api/ged';
import FileType from '../../../../../../utils/enums/FileType';
import { Link, getRouteApi } from '@tanstack/react-router';
import { createTask } from '../../../../../../utils/api/task';
import { businesses } from '../../../../../../utils/constants/queryKeys/business';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import styles from './Footer.module.scss';
import { filterRecursively } from '../../../../../../utils/functions/arrays';

const Route = getRouteApi('/app');

export default function AppViewBusinessGedModalComponentFooterComponent() {
  const { businessId } = Route.useSearch();

  const { data: business } = useSuspenseQuery(businesses.detail(businessId!));

  const { data: canSendTask } = useQuery({
    queryKey: gedQueryKeys.detailByTypeAndId(FileType.AFFAIRE, businessId!),
    queryFn: () => getDirectoryByTypeAndIdOnS3(FileType.AFFAIRE, businessId!),
    select: (data) => filterRecursively(data, 'subRows', (item) => !item.dir),
  });

  const { mutate: sendTaskToVizeo, isPending: sendTaskPending } = useMutation({
    mutationFn: () =>
      createTask({
        name: business.profileName,
        author: business.profileName,
        content: `Nouveau MPV à traiter ${business.numBusiness}`,
        type: WorkloadType.COLLECTIVE,
        deadline: new Date(),
        senderId: null,
        enterpriseName: business.enterpriseName,
        businessId: business.id,
        businessNum: business.numBusiness,
      }),
    onSuccess: () => {
      toast.success(`Notification envoyée à vizeo`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'envoi de la notification à Vizeo");
    },
  });

  return (
    <>
      <PulseLoader color="#31385A" loading={sendTaskPending} className="" size={10} speedMultiplier={0.5} />
      <div className={styles.modal_footer}>
        {canSendTask ? (
          <button className="btn btn-primary-light" onClick={() => sendTaskToVizeo()}>
            {"Transférer l'étude à VIZEO"}
          </button>
        ) : (
          <Link from={Route.id} search={(old) => ({ ...old, appModal: undefined, businessId: undefined })} className="btn btn-primary-light">
            Fermer
          </Link>
        )}
        {/* <Link to={`/app/business/get-business/${businessId}`} className="btn btn-secondary">
          {"Je fais l'étude"}
        </Link> // TODO: Reimplement this */}
      </div>
    </>
  );
}
