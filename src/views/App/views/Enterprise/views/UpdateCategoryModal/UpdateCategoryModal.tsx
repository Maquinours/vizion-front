import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { enterpriseCategories } from '../../../../../../utils/constants/enterpriseCategories';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import enterpriseQueryKeys from '../../../../../../utils/constants/queryKeys/enterprise';
import { getEnterpriseById, updateEnterprise } from '../../../../../../utils/api/enterprise';
import { PulseLoader } from 'react-spinners';
import styles from './UpdateCategoryModal.module.scss';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import Page from '../../../../../../utils/types/Page';
import { toast } from 'react-toastify';

const Route = getRouteApi('/app/enterprises/$enterpriseId/update-category');

const possibleCategories = enterpriseCategories.filter(
  (category) => ![CategoryClient.VIZEO, CategoryClient.FOURNISSEUR, CategoryClient.REPRESENTANT].includes(category.value),
);

const yupSchema = yup.object({
  category: yup
    .object({
      label: yup.string().required(),
      value: yup.mixed<CategoryClient>().required(),
    })
    .required('La catégorie est requise.'),
});

export default function AppViewEnterpriseViewUpdateCategoryModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { enterpriseId } = Route.useParams();

  const { data: enterprise } = useSuspenseQuery({
    queryKey: enterpriseQueryKeys.detailById(enterpriseId),
    queryFn: () => getEnterpriseById(enterpriseId),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateEnterprise(enterprise, {
        name: enterprise.name,
        sign: enterprise.sign,
        category: data.category.value,
        addressLineOne: enterprise.addressLineOne,
        addressLineTwo: enterprise.addressLineTwo,
        zipCode: enterprise.zipCode,
        city: enterprise.city,
        department: enterprise.department,
        departmentCode: enterprise.departmentCode,
        country: enterprise.country,
        email: enterprise.email,
        phoneNumber: enterprise.phoneNumber,
      }),
    onSuccess: (data) => {
      queryClient.setQueriesData<EnterpriseResponseDto>({ queryKey: enterpriseQueryKeys.details() }, (old) => (old?.id === data.id ? data : old));
      queryClient.setQueriesData<Array<EnterpriseResponseDto>>({ queryKey: enterpriseQueryKeys.lists() }, (old) =>
        old?.map((e) => (e.id === data.id ? data : e)),
      );
      queryClient.setQueriesData<Page<EnterpriseResponseDto>>({ queryKey: enterpriseQueryKeys.pages() }, (old) =>
        old ? { ...old, content: old.content.map((e) => (e.id === data.id ? data : e)) } : old,
      );
      toast.success('La catégorie a été modifiée avec succès.');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification de la catégorie.');
    },
  });

  useEffect(() => {
    const category = possibleCategories.find((cat) => cat.value === enterprise.category);
    if (category) setValue('category', category);
  }, [setValue, enterprise.category]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>Modification de la catégorie</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="currentCategory">
              Catégorie :
            </label>
            <div className={styles.react_select_custom}>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <CustomSelect options={possibleCategories} placeholder="Choisir la catégorie" value={value} onChange={onChange} />
                )}
                name="category"
                control={control}
              />
            </div>
            <p className={styles.__errors}>{errors.category?.message}</p>
          </div>

          <div className={styles.loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.buttons}>
            <Link from={Route.id} to={'..'} search={(old) => old} className="btn btn-primary-light">
              Annuler
            </Link>
            <button type="submit" className="btn btn-secondary">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
