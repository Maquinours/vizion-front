import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import { relateAllBusinessToEnterprise } from '../../../../../../utils/api/allBusiness';
import { queries } from '../../../../../../utils/constants/queryKeys';
import PartialAllBusinessResponseDto from '../../../../../../utils/types/PartialAllBusinessResponseDto';
import styles from './RelateBusinessRmaModal.module.scss';

const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/relate-business-rma');

const yupSchema = yup.object().shape({
  associatedBusiness: yup.mixed<PartialAllBusinessResponseDto>().required('Veuillez sélectionner une affaire'),
});

export default function AppViewEnterpriseViewRelateBusinessRmaModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { enterpriseId } = routeApi.useParams();
  const { defaultBusinessRmaId } = routeApi.useSearch();

  const { control, resetField, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data: options, isLoading: isLoadingOptions } = useQuery(queries['all-businesses'].partial._ctx.list._ctx.notAssociatedByEnterpriseId(enterpriseId));

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ associatedBusiness }: yup.InferType<typeof yupSchema>) => relateAllBusinessToEnterprise(associatedBusiness.id, enterpriseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['all-businesses']._def });
      toast.success("L'affaire a bien été ajoutée à l'entreprise");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout de cette affaire à votre entreprise");
    },
  });

  useEffect(() => {
    const option = options?.find((option) => option.businessId === defaultBusinessRmaId);
    resetField('associatedBusiness', { defaultValue: option });
  }, [defaultBusinessRmaId, options]);

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Lier une affaire à l&apos;entreprise</h6>
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
                      getOptionLabel={(opt) => `${opt.title ? `${opt.title} / ` : ''}${opt.number}`}
                      getOptionValue={(opt) => opt.id}
                      value={value}
                      onChange={onChange}
                      placeholder="Sélectionner une affaire"
                    />
                  )}
                />
              </div>
            </div>

            <div className="mx-4 flex items-center justify-center">
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
