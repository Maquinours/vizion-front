import { useForm } from 'react-hook-form';
import styles from './AddSerialNumberSection.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';
import { getRouteApi } from '@tanstack/react-router';
import { createBpSerial } from '../../../../../../../../../../../../utils/api/businessBpSerials';
import SerialNumberOperationType from '../../../../../../../../../../../../utils/enums/SerialNumberOperationType';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
import BusinessBpResponseDto from '../../../../../../../../../../../../utils/types/BusinessBpResponseDto';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp');

const yupSchema = yup.object({
  serialNumber: yup
    .string()
    .required('Numéro de série requis')
    .transform((value) => value.toUpperCase()),
});

export default function AppViewBusinessViewBpViewHeaderComponentSectionTwoComponentAddSerialNumberSectionComponent() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: bp } = useSuspenseQuery(queries['business-bps'].detail._ctx.byBusinessId(businessId));

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async ({ serialNumber }: yup.InferType<typeof yupSchema>) => {
      const productSerialNumber = await queryClient.ensureQueryData(queries['product-serial-numbers'].detail._ctx.byNumber(serialNumber));
      const detail = bp.bpDetailsList.find(
        (detail) => detail.productReference === productSerialNumber.productRef && (detail.quantityPrep ?? 0) < (detail.quantity ?? 0),
      );
      if (!detail) throw new Error('SERIAL NUMBER NOT IN BP');
      return {
        detail,
        serial: await createBpSerial({
          productId: productSerialNumber.productId,
          productVersionId: productSerialNumber.productVersionId,
          bpId: bp.id,
          bpDetailId: detail.id,
          buninessNumber: business.numBusiness,
          productReference: productSerialNumber.productRef,
          productVersionReference: productSerialNumber.productVersionRef,
          numBP: bp.number,
          numSerie: productSerialNumber.serialNumber,
          type: SerialNumberOperationType.DESTOCK,
          shelfId: null,
          extern: false,
        }),
      };
    },
    onMutate: () => {
      reset();
    },
    onSuccess: ({ detail, serial }) => {
      queryClient.setQueryData<BusinessBpResponseDto>(queries['business-bps'].detail._ctx.byBusinessId(businessId).queryKey, (old) =>
        old
          ? {
              ...old,
              bpDetailsList: old.bpDetailsList.map((d) => (d.id === detail.id ? { ...d, bpSerialList: [...(detail.bpSerialList ?? []), serial] } : d)),
            }
          : old,
      );
      queryClient.invalidateQueries(queries['business-bps'].detail._ctx.byBusinessId(businessId));
      toast.success('Numéro de série ajouté avec succès');
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.config?.url === '/product-inventory/v1/serial/find/serial-number' && error.response?.status === 404)
          toast.error('Numéro de série introuvable');
      } else if (error.message === 'SERIAL NUMBER NOT IN BP') toast.error(' Le numéro de série ne correspond à aucun des produits dans le BP');
      else {
        console.error(error);
        toast.error("Une erreur est survenue lors de l'ajout du numéro de série");
      }
    },
  });

  return (
    <div className={styles.serial_number}>
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <div className={styles.form_group}>
          <label htmlFor="serialNumber">Saisir numéro de série</label>
          <input id="serialNumber" {...register('serialNumber')} autoFocus />
          <p className={styles.__errors}>{errors.serialNumber?.message}</p>
        </div>
        <div className={styles.button_container}>
          <button type="submit" className="btn btn-primary">
            OK
          </button>
        </div>
      </form>
    </div>
  );
}
