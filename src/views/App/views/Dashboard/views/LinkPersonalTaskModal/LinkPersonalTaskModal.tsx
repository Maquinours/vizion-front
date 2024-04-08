import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { getTaskById, updateTask } from '../../../../../../utils/api/task';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { allBusinesses } from '../../../../../../utils/constants/queryKeys/allBusiness';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import { taskQueryKeys } from '../../../../../../utils/constants/queryKeys/task';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import Page from '../../../../../../utils/types/Page';
import ProductResponseDto from '../../../../../../utils/types/ProductResponseDto';
import TaskRequestDto from '../../../../../../utils/types/TaskRequestDto';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import styles from './LinkPersonalTaskModal.module.scss';

enum LinkType {
  BUSINESS,
  PRODUCT,
  ENTERPRISE,
}

const Route = getRouteApi('/app/dashboard/link-personal-task/$taskId');

const yupSchema = yup.object({
  type: yup.mixed<LinkType>().required(),
  business: yup.mixed<AllBusinessResponseDto>().when('type', {
    is: (type: LinkType) => type === LinkType.BUSINESS,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
  product: yup.mixed<ProductResponseDto>().when('type', {
    is: (type: LinkType) => type === LinkType.PRODUCT,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
  enterprise: yup.mixed<EnterpriseResponseDto>().when('type', {
    is: (type: LinkType) => type === LinkType.ENTERPRISE,
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
});

export default function AppViewDashboardViewLinkPersonalTaskModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery({
    queryKey: taskQueryKeys.detailById(taskId),
    queryFn: () => getTaskById(taskId),
  });

  const { data: enterprisesList, isLoading: isLoadingEnterprises } = useQuery(enterprises.list);
  const { data: businesses, isLoading: isLoadingBusiness } = useQuery(allBusinesses.list);
  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const { register, control, watch, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) => {
      let content: TaskRequestDto = {
        type: WorkloadType.PERSONELLE,
        content: task.content ?? '',
        name: task.name,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
        profileId: task.profileId,
        senderId: task.senderId,
        mailId: task.mailId,
        mailHashId: task.mailHashId,
        receiver: task.receiver,
      };
      switch (data.type) {
        case LinkType.BUSINESS:
          if (data.business!.category === CategoryBusiness.AFFAIRE)
            content = { ...content, businessId: data.business!.id, businessNum: data.business!.number, businessName: data.business!.title };
          else if (data.business!.category === CategoryBusiness.RMA) content = { ...content, rmaId: data.business!.id, rmaNum: data.business!.number };
          break;
        case LinkType.PRODUCT:
          content = { ...content, productId: data.product!.id, reference: data.product!.reference };
          break;
        case LinkType.ENTERPRISE:
          content = { ...content, enterpriseId: data.enterprise!.id, enterpriseName: data.enterprise!.name };
          break;
      }
      return updateTask(task.id, task.profileId!, task.state!, content);
    },
    onSuccess: (task) => {
      queryClient.setQueriesData<Page<TaskResponseDto>>({ queryKey: taskQueryKeys.pages() }, (old) =>
        old
          ? {
              ...old,
              content: old.content.map((t) => (t.id === task.id ? task : t)),
            }
          : old,
      );
      queryClient.setQueriesData<Array<TaskResponseDto>>({ queryKey: taskQueryKeys.lists() }, (old) =>
        old ? old.map((t) => (t.id === task.id ? task : t)) : old,
      );
      queryClient.setQueriesData<TaskResponseDto>({ queryKey: taskQueryKeys.details() }, (old) => (old?.id === task.id ? task : old));
      toast.success('Tâche liée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la liaison de la tâche');
    },
  });

  const select = (() => {
    switch (watch('type')) {
      case LinkType.BUSINESS:
        return (
          <Controller
            name="business"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomSelect
                placeholder="Sélectionnez une affaire"
                options={businesses}
                isLoading={isLoadingBusiness}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        );
      case LinkType.PRODUCT:
        return (
          <Controller
            name="product"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomSelect
                placeholder="Sélectionnez un produit"
                options={products}
                isLoading={isLoadingProducts}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        );
      case LinkType.ENTERPRISE:
        return (
          <Controller
            name="enterprise"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomSelect
                placeholder="Sélectionnez une entreprise"
                options={enterprisesList}
                isLoading={isLoadingEnterprises}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            )}
          />
        );
    }
  })();

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal_link} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Liaison de la charge à un élément</p>
        </div>

        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form__radio_group}>
              <div className={styles.form__radio}>
                <input type="radio" id="choose-business" {...register('type')} value={LinkType.BUSINESS} />
                <label className={styles.label} htmlFor="choose-business">
                  Affaire ou RMA
                </label>
              </div>
              <div className={styles.form__radio}>
                <input type="radio" {...register('type')} id="choose-product" value={LinkType.PRODUCT} />
                <label className={styles.label} htmlFor="choose-product">
                  Produit
                </label>
              </div>
              <div className={styles.form__radio}>
                <input type="radio" id="choose-enterprise" {...register('type')} value={LinkType.ENTERPRISE} />
                <label className={styles.label} htmlFor="choose-enterprise">
                  Enterprise
                </label>
              </div>
            </div>
            <div className={styles.react_select}>{select}</div>
            <div className={styles.form_loader}>
              <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.form_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" disabled={isPending} className="btn btn-secondary">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
