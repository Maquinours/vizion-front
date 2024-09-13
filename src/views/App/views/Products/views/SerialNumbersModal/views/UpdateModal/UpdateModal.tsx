import { getRouteApi } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './UpdateModal.module.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProductSerialNumberNote } from '../../../../../../../../utils/api/productSerialNumber';
import { toast } from 'react-toastify';
import { queries } from '../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/products/serial-numbers/update/$serialNumberId');

const yupSchema = yup.object({
  note: yup.string().nullable().max(255, 'La note ne peut excéder 255 caractères'),
});

export default function AppViewProductsViewSerialNumbersModalViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();
  const { serialNumber } = routeApi.useLoaderData();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      note: serialNumber.note ?? '',
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ note }: yup.InferType<typeof yupSchema>) => updateProductSerialNumberNote(serialNumber.id, { note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-serial-numbers']._def });
      toast.success('Le numéro de série a été modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du numéro de série');
    },
  });

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={!isPending}
      shouldCloseOnEsc={!isPending}
    >
      <p className="w-full rounded-t-md bg-[var(--primary-color)] p-2 text-center font-bold text-white">Modification du numéro de série</p>
      <form onSubmit={handleSubmit((data) => mutate(data))} className="flex flex-col gap-y-2 p-4">
        <div className="flex justify-center gap-x-1">
          <span>Numéro de série :</span>
          <span>{serialNumber.serialNumber}</span>
        </div>
        <div className="flex justify-center gap-x-1">
          <span>Référence du produit :</span>
          <span>{serialNumber.productRef}</span>
        </div>
        <div className="flex flex-col justify-center gap-y-1 text-center">
          <label htmlFor="note">Note :</label>
          <textarea id="note" {...register('note')} className="w-full rounded-md border border-black" />
          <p className="text-xs text-[var(--secondary-color)]">{errors.note?.message}</p>
        </div>
        <div className="mt-2 flex justify-between gap-y-1">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isPending}>
            Annuler
          </button>
          <button className="btn btn-primary" type="submit" disabled={isPending}>
            {isPending ? 'Modification en cours...' : 'Modifier'}
          </button>
        </div>
      </form>
    </ReactModal>
  );
}
