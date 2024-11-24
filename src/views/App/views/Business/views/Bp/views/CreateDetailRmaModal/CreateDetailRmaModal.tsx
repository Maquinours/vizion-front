import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { createRmaFromBusiness } from '../../../../../../../../utils/api/rma';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../../../utils/enums/CategoryBusiness';
import BusinessBpSerialResponseDto from '../../../../../../../../utils/types/BusinessBpSerialResponseDto';
import styles from './CreateDetailRmaModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp/create-detail-rma/$detailId');

const yupSchema = yup.object().shape({
  serialNumbers: yup.array().of(yup.mixed<BusinessBpSerialResponseDto>().required()).required(),
});

export default function AppViewBusinessViewBpViewCreateDetailRmaModalView() {
  const navigate = routeApi.useNavigate();

  const { businessId, detailId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: detail } = useSuspenseQuery(queries['business-bp-details'].detail._ctx.byId(detailId));

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ serialNumbers }: yup.InferType<typeof yupSchema>) =>
      createRmaFromBusiness(
        CategoryBusiness.AFFAIRE,
        business.numBusiness,
        serialNumbers.map((s) => s.numSerie),
      ),
    onSuccess: (rma) => {
      toast.success('Le RMA a été généré avec succès');
      navigate({ to: '/app/businesses-rma/rma/$rmaId', params: { rmaId: rma.id } });
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération du RMA');
    },
  });

  return (
    <ReactModal
      isOpen={true}
      overlayClassName="Overlay"
      className={styles.modal}
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
      onRequestClose={onClose}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Création du RMA</h6>
        </div>
        <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
          <div className={styles.modal_content}>
            <div className={styles.form_group}>
              <label htmlFor="serialNumbers">Sélection</label>
              <div className={styles.react_select_custom}>
                <Controller
                  name="serialNumbers"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      placeholder="Choisir le(s) numéro(s) de série"
                      options={detail.bpSerialList ?? []}
                      getOptionLabel={(opt) => opt.numSerie}
                      getOptionValue={(opt) => opt.id}
                      isMulti
                      value={value}
                      onChange={onChange}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          backgroundColor: '#f2f3f8',
                          border: 1,
                          color: 'black',
                          '::placeholder': {
                            ...styles['::placeholder'],
                            color: 'red',
                          },
                        }),
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
          <div className={styles.modal_loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>
          <div className={styles.modal_buttons}>
            <button type="reset" className="btn btn-primary-light">
              Annuler
            </button>
            <button type="submit" className="btn btn-secondary">
              Générer
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
