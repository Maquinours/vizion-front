import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, Outlet } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import TableComponent from '../../../../../../../../components/Table/Table';
import { updateBusinessBlDetails } from '../../../../../../../../utils/api/businessBlDetails';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import styles from './UpdateModal.module.scss';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bl/update');

const yupSchema = yup.object().shape({
  items: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          id: yup.string().required(),
          productReference: yup.string().required('Champs requis').max(255, 'La référence est trop longue'),
          productDesignation: yup.string().required('Champs requis').max(255, 'La désignation est trop longue'),
        })
        .required(),
    )
    .required('Champs requis'),
});

const columnHelper = createColumnHelper<{ id: string; productReference: string; productDesignation: string }>();

export default function AppViewBusinessViewBlViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { businessId } = routeApi.useParams();
  const { page } = routeApi.useSearch();

  const { data: blDetails } = useSuspenseQuery({
    ...queries['business-bls'].list._ctx.byBusinessId(businessId),
    select: (data) => data.at(page)?.blDetailsList,
  });

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      items: [],
    },
  });

  const items = useWatch({ name: 'items', control });

  const columns = useMemo(() => [
    columnHelper.display({
      header: 'Référence',
      cell: ({ row: { index } }) => (
        <div className="flex w-auto flex-col gap-y-1">
          <input type="text" {...register(`items.${index}.productReference`)} className="box-border flex w-full border border-black p-1 text-center" />
          <p className={styles.__errors}>{errors.items?.[index]?.productReference?.message}</p>
        </div>
      ),
    }),
    columnHelper.display({
      header: 'Désignation',
      cell: ({ row: { index } }) => (
        <div className="flex w-auto flex-col gap-y-1">
          <input type="text" {...register(`items.${index}.productDesignation`)} className="box-border w-full border border-black p-1 text-center" />
          <p className={styles.__errors}>{errors.items?.[index]?.productDesignation?.message}</p>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'scrollbar_compensator',
    }),
  ], [register, errors]);

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ items }: yup.InferType<typeof yupSchema>) => updateBusinessBlDetails(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-bls']._def });
      toast.success('Les détails du bon de livraison ont été modifiés avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification des détails du bon de livraison');
    },
  });

  useEffect(() => {
    if (!isDirty)
      reset({
        items: blDetails?.map((detail) => ({ id: detail.id, productReference: detail.productReference, productDesignation: detail.productDesignation })),
      });
  }, [blDetails]);

  return (
    <>
      <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay" shouldCloseOnOverlayClick={!isPending}>
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Modification des détails du bon de livraison</h6>
          </div>
          <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
            <div className={styles.modal_content}>
              <div className={styles.table_container}>
                <TableComponent columns={columns} data={items} />
              </div>
            </div>

            <div className={styles.modal_loader}>
              <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
            </div>

            <div className={styles.modal_buttons}>
              <button type="reset" className="btn btn-primary-light">
                Annuler
              </button>
              <button type="submit" disabled={isPending} className="btn btn-secondary">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
      <Outlet />
    </>
  );
}
