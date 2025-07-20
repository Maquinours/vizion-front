import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { relateAllBusinessToEnterprise } from '../../../../utils/api/allBusiness';
import { queries } from '../../../../utils/constants/queryKeys';
import AllBusinessResponseDto from '../../../../utils/types/AllBusinessResponseDto';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import CustomSelect from '../../../CustomSelect/CustomSelect';
import styles from './RelateBusinessRmaModal.module.scss';

// const routeApi = getRouteApi('/app/enterprises_/$enterpriseId/relate-business-rma');

const yupSchema = yup.object().shape({
  associatedBusiness: yup.mixed<AllBusinessResponseDto>().required('Veuillez sélectionner une affaire'),
});

type EnterpriseModalComponentRelateBusinessRmaComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onClose: () => void;
}>;
export default function EnterpriseModalComponentRelateBusinessRmaComponent({ enterprise, onClose }: EnterpriseModalComponentRelateBusinessRmaComponentProps) {
  const queryClient = useQueryClient();
  //   const navigate = routeApi.useNavigate();

  //   const { enterpriseId } = routeApi.useParams();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { data: options, isLoading: isLoadingOptions } = useQuery(queries['all-businesses'].list._ctx.notAssociatedByEnterpriseId(enterprise.id));

  //   const onClose = () => {
  //     navigate({ to: '..', search: true, replace: true, resetScroll: false });
  //   };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ associatedBusiness }: yup.InferType<typeof yupSchema>) => relateAllBusinessToEnterprise(associatedBusiness.id, enterprise.id),
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
