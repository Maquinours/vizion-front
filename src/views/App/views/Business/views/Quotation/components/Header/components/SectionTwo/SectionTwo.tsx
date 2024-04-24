import { useForm } from 'react-hook-form';
import styles from './SectionTwo.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdSave } from 'react-icons/md';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { updateBusinessQuotation } from '../../../../../../../../../../utils/api/businessQuotations';
import { getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation');

const yupSchema = yup.object().shape({
  documentName: yup.string().required('Le nom du document est requis'),
});

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionTwoComponent() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      documentName: quotation.documentName ?? '',
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations']._def });
      toast.success('Le nom du document a été mis à jour');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la mise à jour du nom du document');
    },
  });

  return (
    <div className={styles._one}>
      <div className={styles.document_name}>
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label htmlFor="documentName">Nom du document</label>
            <div>
              <input id="documentName" placeholder="Devis" {...register('documentName')} />
              <button disabled={isPending} type="submit">
                <MdSave />
              </button>
            </div>
            <p className={styles.__errors}>{errors.documentName?.message}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
