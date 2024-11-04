import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { updateTask } from '../../../../../../utils/api/task';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { allBusinesses } from '../../../../../../utils/constants/queryKeys/allBusiness';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import WorkloadType from '../../../../../../utils/enums/WorkloadType';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import ProductResponseDto from '../../../../../../utils/types/ProductResponseDto';
import TaskRequestDto from '../../../../../../utils/types/TaskRequestDto';
import styles from './LinkPersonalTaskModal.module.scss';

enum LinkType {
  BUSINESS = 'BUSINESS',
  PRODUCT = 'PRODUCT',
  ENTERPRISE = 'ENTERPRISE',
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

  const { data: task } = useSuspenseQuery(queries.tasks.detail(taskId));

  const { data: enterprisesList, isLoading: isLoadingEnterprises } = useQuery(enterprises.list);
  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery(allBusinesses.list);
  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const { register, control, getValues, watch, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '../..', search: (old) => old, replace: true, resetScroll: false });
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
            content = { ...content, businessId: data.business!.businessId, businessNum: data.business!.number, businessName: data.business!.title };
          else if (data.business!.category === CategoryBusiness.RMA) content = { ...content, rmaId: data.business!.businessId, rmaNum: data.business!.number };
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.tasks._def });
      toast.success('Tâche liée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la liaison de la tâche');
    },
  });

  const select = useMemo(() => {
    const type = getValues('type');
    return (
      <>
        <Controller
          name="business"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <CustomSelect
              placeholder="Sélectionnez une affaire"
              options={businesses}
              getOptionLabel={(opt) => `${opt.number}${opt.title ? ` / ${opt.title}` : ''}`}
              getOptionValue={(opt) => opt.id}
              isLoading={isLoadingBusinesses}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              styles={{ container: (baseStyles) => ({ ...baseStyles, display: type !== LinkType.BUSINESS ? 'none' : baseStyles.display }) }}
            />
          )}
        />
        <Controller
          name="product"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <CustomSelect
              placeholder="Sélectionnez un produit"
              options={products}
              getOptionLabel={(opt) => opt.reference ?? ''}
              getOptionValue={(opt) => opt.id}
              isLoading={isLoadingProducts}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              styles={{ container: (baseStyles) => ({ ...baseStyles, display: type !== LinkType.PRODUCT ? 'none' : baseStyles.display }) }}
            />
          )}
        />
        <Controller
          name="enterprise"
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <CustomSelect
              placeholder="Sélectionnez une entreprise"
              options={enterprisesList}
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt.id}
              isLoading={isLoadingEnterprises}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              styles={{ container: (baseStyles) => ({ ...baseStyles, display: type !== LinkType.ENTERPRISE ? 'none' : baseStyles.display }) }}
            />
          )}
        />
      </>
    );
  }, [watch('type'), businesses, products, isLoadingBusinesses, enterprisesList, isLoadingProducts, isLoadingEnterprises]);

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
