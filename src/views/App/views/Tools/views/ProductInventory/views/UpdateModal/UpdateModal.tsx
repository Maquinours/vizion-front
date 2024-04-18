import ReactModal from 'react-modal';
import styles from './UpdateModal.module.scss';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import ProductShelfResponseDto from '../../../../../../../../utils/types/ProductShelfResponseDto';
import ProductVersionResponseDto from '../../../../../../../../utils/types/ProductVersionResponseDto';
import { updateShelf } from '../../../../../../../../utils/api/productShelf';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const routeApi = getRouteApi('/app/tools/product-inventory/update/$stockId');

const yupSchema = yup.object().shape({
  productVersion: yup.mixed<ProductVersionResponseDto>().required('Champs requis'),
  productShelf: yup.mixed<ProductShelfResponseDto>().required('Champs requis'),
  theoricQuantity: yup.number().typeError('Format invalide').required('Champs requis'),
  comptedQuantity: yup.number().typeError('Format invalide').required('Champs requis'),
});

export default function AppViewToolsViewProductInventoryViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: routeApi.id });

  const { stockId } = routeApi.useParams();

  const { data: productVersionShelfStock } = useSuspenseQuery(queries['product-version-shelf-stocks'].detail._ctx.byId(stockId));

  const { data: productVersions, isLoading: isLoadingProductVersions } = useQuery(
    queries['product-versions'].list._ctx.byProductId(productVersionShelfStock.productId!),
  );

  const { data: productShelves, isLoading: isLoadingProductShelves } = useQuery(queries['product-shelves'].list);

  const {
    register,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      productShelf: productVersionShelfStock.productVersionShelf!,
      theoricQuantity: productVersionShelfStock.currentStock ?? 0,
      comptedQuantity: productVersionShelfStock.currentStock ?? 0,
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: (old) => old, replace: true });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ productShelf, productVersion, comptedQuantity }: yup.InferType<typeof yupSchema>) =>
      updateShelf({
        oldDto: {
          number: productVersionShelfStock.productVersionShelf?.number,
          updateNumber: productVersionShelfStock.productVersionShelf?.number,
          note: productVersionShelfStock.productVersionShelf?.note,
          productVersionShelfStockDto: {
            productVersionId: productVersionShelfStock.productVersionId,
            productVersionShelfId: productVersionShelfStock.productVersionShelf?.id,
            productId: productVersionShelfStock.productId,
            providerId: productVersionShelfStock.providerId,
            providerName: productVersionShelfStock.providerName,
            reference: productVersionShelfStock.reference,
            versionReference: productVersionShelfStock.versionReference,
            shortDescription: productVersionShelfStock.shortDescription,
            category: productVersionShelfStock.category,
            publicPrice: productVersionShelfStock.publicPrice,
            currentStock: 0,
          },
        },
        newDto: {
          number: productShelf.number,
          updateNumber: productShelf.number,
          note: productShelf.note,
          productVersionShelfStockDto: {
            productVersionId: productVersion.id,
            productVersionShelfId: productShelf.id,
            productId: productVersionShelfStock.productId,
            providerId: productVersionShelfStock.providerId,
            providerName: productVersionShelfStock.providerName,
            reference: productVersionShelfStock.reference,
            versionReference: productVersion.reference,
            shortDescription: productVersionShelfStock.shortDescription,
            category: productVersionShelfStock.category,
            publicPrice: productVersionShelfStock.publicPrice,
            currentStock: comptedQuantity,
          },
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['product-shelves']._def });
      queryClient.invalidateQueries({ queryKey: queries['product-version-shelf-stocks']._def });
      toast.success('Etagère modifiée avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification de l'étagère");
    },
  });

  useEffect(() => {
    if (productVersions) {
      const version = productVersions.find((pv) => pv.id === productVersionShelfStock.productVersionId);
      if (version) setValue('productVersion', version);
    }
  }, [isLoadingProductVersions]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>{"Modifier l'étagère"}</h6>
        </div>
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productShelf">
              Etagère :
            </label>
            <div className={styles.react_select_custom}>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    options={productShelves}
                    getOptionLabel={(opt) => opt.number ?? ''}
                    getOptionValue={(opt) => opt.id}
                    placeholder="Choisir l'étagère"
                    isLoading={isLoadingProductShelves}
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="productShelf"
                control={control}
              />
            </div>
            <p className={styles.__errors}>{errors.productShelf?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="productVersion">
              Version :
            </label>
            <div className={styles.react_select_custom}>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    options={productVersions}
                    getOptionLabel={(opt) => opt.reference ?? ''}
                    getOptionValue={(opt) => opt.id}
                    placeholder="Choisir la version"
                    isLoading={isLoadingProductVersions}
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="productVersion"
                control={control}
              />
            </div>
            <p className={styles.__errors}>{errors.productVersion?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="theroicQuantity">
              Quantité théorique:
            </label>
            <input placeholder="..." type="number" {...register('theoricQuantity')} readOnly />
            <p className={styles.__errors}>{errors.theoricQuantity?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="comptedQuantity">
              Quantité comptée:
            </label>
            <input placeholder="..." type="number" {...register('comptedQuantity')} />
            <p className={styles.__errors}>{errors.comptedQuantity?.message}</p>
          </div>

          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" disabled={isPending} onClick={() => onClose()}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
