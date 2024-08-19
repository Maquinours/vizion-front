import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';
import AllBusinessResponseDto from '../../../../../../../../utils/types/AllBusinessResponseDto';
import styles from './CreateLinkModal.module.scss';
import { associateAllBusiness } from '../../../../../../../../utils/api/allBusiness';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/create-link');

const yupSchema = yup.object().shape({
  associatedBusiness: yup.mixed<AllBusinessResponseDto>().required('Ce champ est requis'),
});

export default function AppViewBusinessViewDashboardViewCreateLinkModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const { data: options, isLoading: isLoadingOptions } = useQuery(
    queries['all-businesses'].list._ctx.notAssociated({ category: CategoryBusiness.AFFAIRE, number: business.numBusiness }),
  );

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ associatedBusiness }: yup.InferType<typeof yupSchema>) =>
      associateAllBusiness(
        { category: CategoryBusiness.AFFAIRE, number: business.numBusiness },
        { category: associatedBusiness.category, number: associatedBusiness.number },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['all-businesses']._def });
      toast.success("L'affaire a bien été reliée");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la liaison de l'affaire");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Relier à une affaire</h6>
        </div>

        <div className={styles.modal_form_content}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <label htmlFor="associatedAllBusiness">Affaire :</label>
              <div className={styles.react_select_custom}>
                <Controller
                  control={control}
                  name="associatedBusiness"
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      id="associatedAllBusiness"
                      options={options}
                      isLoading={isLoadingOptions}
                      getOptionLabel={(opt) => `${!!opt.title ? `${opt.title} / ` : ''}${opt.number}`}
                      getOptionValue={(opt) => opt.id}
                      value={value}
                      onChange={onChange}
                      placeholder="Sélectionner une affaire"
                    />
                  )}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '1rem 0',
              }}
            >
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.footer_buttons}>
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button className="btn btn-secondary">Ajouter</button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
