import { Link, getRouteApi, useNavigate } from '@tanstack/react-router';
import * as yup from 'yup';
import { enterprises } from '../../../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { Controller, useForm } from 'react-hook-form';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import { toast } from 'react-toastify';
import styles from './UpdateRepresentativeModal.module.scss';
import { updateEnterpriseInfoSup } from '../../../../../../utils/api/enterpriseInfoSup';

const Route = getRouteApi('/app/enterprises/$enterpriseId/update-representative');

const yupSchema = yup.object({
  representative: yup.mixed<EnterpriseResponseDto>().nullable(),
  relationOne: yup.string().nullable(),
  relationTwo: yup.string().nullable(),
  relationThree: yup.string().nullable(),
  website: yup.string().nullable(),
});

export default function AppViewEnterpriseViewUpdateRepresentativeModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { enterpriseId } = Route.useParams();

  const { data: enterprise } = useSuspenseQuery(enterprises.detail(enterpriseId));

  const { data: representatives, isLoading: isLoadingRepresentatives } = useQuery(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      representative: enterprise.infoSup!.representative,
      relationOne: enterprise.infoSup!.enterpriseRelationShips?.at(0)?.fullName,
      relationTwo: enterprise.infoSup!.enterpriseRelationShips?.at(1)?.fullName,
      relationThree: enterprise.infoSup!.enterpriseRelationShips?.at(2)?.fullName,
      website: enterprise.infoSup!.webSite,
    },
  });

  const onClose = () => {
    navigate({ from: Route.id, to: '..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: yup.InferType<typeof yupSchema>) =>
      updateEnterpriseInfoSup(enterprise.infoSup!, {
        representativeId: data.representative?.id,
        enterpriseRelationShips: [data.relationOne, data.relationTwo, data.relationThree].filter((data) => !!data).map((itm) => ({ fullName: itm as string })),
        webSite: data.website,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enterprises._def });
      toast.success('Le représentant a été modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du représentant');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <h6>Modifier le représentant</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.card_container}>
            <div className={styles.form_container}>
              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="company_representative">
                  Représentant :
                </label>
                <Controller
                  control={control}
                  name="representative"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomSelect
                      options={representatives}
                      placeholder="Sélectionnez un représentant"
                      isLoading={isLoadingRepresentatives}
                      getOptionLabel={(opt) => opt.name ?? ''}
                      getOptionValue={(opt) => opt.id}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                <p className={styles.__errors}>{errors.representative?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="company_relation_one">
                  En relation avec :
                </label>
                <input {...register('relationOne')} name="company_relation_one" id="company_relation_one" />
                <p className={styles.__errors}>{errors.relationOne?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="company_relation_two">
                  En relation avec :
                </label>
                <input {...register('relationTwo')} name="company_relation_two" id="company_relation_two" />
                <p className={styles.__errors}>{errors.relationTwo?.message}</p>
              </div>

              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="company_relation_three">
                  En relation avec :
                </label>
                <input {...register('relationThree')} name="company_relation_three" id="company_relation_three" />
                <p className={styles.__errors}>{errors.relationThree?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="company_website">
                  Site internet :
                </label>
                <input
                  {...register('website')}
                  type="url"
                  placeholder="Site internet"
                  name="company_website"
                  id="company_website"
                  autoCorrect="true"
                  autoComplete="off"
                />
                <p className={styles.__errors}>{errors.website?.message}</p>
              </div>
              <div className={styles.form_request_loader}>
                <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
              </div>

              <div className={styles.form_buttons}>
                <Link from={Route.id} to=".." search={(old) => old} className="btn btn-primary" disabled={isPending}>
                  Annuler
                </Link>
                <button type="submit" className="btn btn-secondary">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
