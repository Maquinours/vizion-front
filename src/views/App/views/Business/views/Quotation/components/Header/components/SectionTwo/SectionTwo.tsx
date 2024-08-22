import { useForm } from 'react-hook-form';
import styles from './SectionTwo.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdSave } from 'react-icons/md';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { updateBusinessQuotation } from '../../../../../../../../../../utils/api/businessQuotations';
import { getRouteApi, useBlocker } from '@tanstack/react-router';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';
import UnsavedChangesBlockingModalComponent from '../../../../../../../../../../components/UnsavedChangesBlockingModal/UnsavedChangesBlockingModal';
import { useEffect, useMemo } from 'react';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation');

const yupSchema = yup.object().shape({
  documentName: yup.string().required('Le nom du document est requis'),
});

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionTwoComponent() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const formDefaultValues = useMemo(() => ({ documentName: quotation.documentName ?? '' }), [quotation.documentName]);

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: formDefaultValues,
  });

  const { status, proceed, reset } = useBlocker({
    condition: isDirty,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ documentName }: yup.InferType<typeof yupSchema>) =>
      updateBusinessQuotation(quotation.id, {
        businessId,
        number: quotation.number,
        documentName,
        shippingServicePrice: quotation.shippingServicePrice,
        vat: quotation.vat,
        totalAmount: quotation.totalAmount,
        totalAmountHT: quotation.totalAmountHT,
      }),
    onSuccess: (quotation) => {
      queryClient.setQueryData(queries['business-quotations']._def, quotation);
      toast.success('Le nom du document a été mis à jour');
      if (status === 'blocked') proceed();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour du nom du document');
    },
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  useEffect(() => {
    resetForm(formDefaultValues, { keepDirtyValues: true });
  }, [formDefaultValues]);

  return (
    <>
      <div className={styles._one}>
        <div className={styles.document_name}>
          <form onSubmit={onSubmit}>
            <div className={styles.form_group}>
              <label htmlFor="documentName">Nom du document</label>
              <div>
                <input id="documentName" readOnly={!!business.archived} placeholder="Devis" {...register('documentName')} />
                {!business.archived && (
                  <button disabled={isPending} type="submit">
                    <MdSave />
                  </button>
                )}
              </div>
              <p className={styles.__errors}>{errors.documentName?.message}</p>
            </div>
          </form>
        </div>
      </div>
      {status === 'blocked' && <UnsavedChangesBlockingModalComponent proceed={proceed} reset={reset} save={onSubmit} isSaving={isPending} />}
    </>
  );
}
