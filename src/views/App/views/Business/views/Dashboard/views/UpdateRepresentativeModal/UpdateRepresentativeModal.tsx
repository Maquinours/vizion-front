import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './UpdateRepresentativeModal.module.scss';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import * as yup from 'yup';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { updateBusiness } from '../../../../../../../../utils/api/business';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard/update-representative');

const yupSchema = yup.object().shape({
  representative: yup.mixed<EnterpriseResponseDto>().nullable(),
});

export default function AppViewBusinessViewDashboardViewUpdateRepresentativeModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: representatives, isLoading: isLoadingRepresentatives } = useQuery(queries.enterprise.list._ctx.byCategory(CategoryClient.REPRESENTANT));

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ representative }: yup.InferType<typeof yupSchema>) =>
      updateBusiness(business.id, {
        ...business,
        billingAddressTwo: business.billingAddressTwo ?? '',
        billingZipCode: business.billingZipCode ?? '',
        billingCompany: business.billingCompany ?? '',
        type: business.type!,
        representativeId: representative?.id,
        representativeName: representative?.name,
        representativeZipCode: representative?.zipCode,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      toast.success('Le représentant a bien été modifié');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du représentant');
    },
  });

  useEffect(() => {
    if (representatives) {
      const representative = representatives.find((r) => r.id === business.representativeId);
      if (representative) setValue('representative', representative);
    }
  }, [isLoadingRepresentatives]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} overlayClassName="Overlay" className={styles.modal}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <div className={styles.modal_title}>Modifier le représentant</div>
        </div>

        <div className={styles.modal_body}>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.form_group}>
              <p>Représentant</p>
              <Controller
                control={control}
                name="representative"
                render={({ field: { value, onChange } }) => (
                  <CustomSelect
                    placeholder="Sélectionnez un représentant"
                    options={representatives}
                    isLoading={isLoadingRepresentatives}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.id}
                    isClearable
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <p className={styles.__errors}>{errors.representative?.message}</p>
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
              <button className="btn btn-secondary" type="submit">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
