import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { getAllProductShelves } from '../../../../../../../../utils/api/productShelf';
import { getProductVersionsByProductId } from '../../../../../../../../utils/api/productVersion';
import { createProductVersionShelfStock } from '../../../../../../../../utils/api/productVersionShelfStock';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { productShelfQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productShelf';
import { productVersionQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productVersion';
import { productVersionShelfStocksQueryKeys } from '../../../../../../../../utils/constants/queryKeys/productVersionShelfStock';
import ProductShelfResponseDto from '../../../../../../../../utils/types/ProductShelfResponseDto';
import ProductVersionResponseDto from '../../../../../../../../utils/types/ProductVersionResponseDto';
import styles from './CreateStockModal.module.scss';

const routeApi = getRouteApi('/app/products/$productId/manage/create-stock');

const yupSchema = yup.object({
  version: yup.mixed<ProductVersionResponseDto>().required('Le produit est requis.'),
  shelf: yup.mixed<ProductShelfResponseDto>().required("L'étagère est requise."),
  quantity: yup.number().typeError('Format invalide').min(0, 'Min 0').required('La quantité est requise.'),
});

export default function AppViewProductViewManageViewCreateStockModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { productId } = routeApi.useParams();

  const { data: product } = useSuspenseQuery(queries.product.detail._ctx.byId(productId));

  const { data: versions, isLoading: isLoadingVersions } = useQuery({
    queryKey: productVersionQueryKeys.listByProductId(productId),
    queryFn: () => getProductVersionsByProductId(productId),
  });

  const { data: shelves, isLoading: isLoadingShelves } = useQuery({
    queryKey: productShelfQueryKeys.listAll(),
    queryFn: getAllProductShelves,
  });

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ version, shelf, quantity }: yup.InferType<typeof yupSchema>) =>
      createProductVersionShelfStock({
        productVersionId: version.id,
        productVersionShelfId: shelf.id,
        productId: product.id,
        providerId: product.providerId,
        providerName: product.providerName,
        reference: product.reference,
        versionReference: version.reference,
        shortDescription: product.shortDescription,
        category: product.category,
        publicPrice: product.publicPrice,
        currentStock: quantity,
        productVersionShelfStockEntryDto: {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productVersionShelfStocksQueryKeys.all });
      toast.success('Stock ajouté avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout du stock");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} shouldCloseOnOverlayClick={!isPending} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Ajouter une étagère</h6>
        </div>

        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="versionId">
              Version de produit :
            </label>
            <div className={styles.react_select_custom}>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    options={versions}
                    isLoading={isLoadingVersions}
                    getOptionLabel={(opt) => opt.reference ?? ''}
                    getOptionValue={(opt) => opt.id}
                    placeholder="Choisir la version"
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="version"
                control={control}
              />
            </div>
            <p className={styles.__errors}>{errors.version?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="shelfId">
              Etagère cible :
            </label>
            <div className={styles.react_select_custom}>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    options={shelves}
                    isLoading={isLoadingShelves}
                    getOptionLabel={(opt) => opt.number ?? ''}
                    getOptionValue={(opt) => opt.id}
                    placeholder={"Choisir l'étagère"}
                    value={value}
                    onChange={onChange}
                  />
                )}
                name="shelf"
                control={control}
              />
            </div>
            <p className={styles.__errors}>{errors.shelf?.message}</p>
          </div>
          <div className={styles.form_group}>
            <label className={styles.label} htmlFor="quantity">
              Quantité :
            </label>
            <input placeholder="..." type="number" {...register('quantity')} />
            <p className={styles.__errors}>{errors.quantity?.message}</p>
          </div>
          <div className={styles.loader}>
            <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
          </div>

          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" disabled={isPending} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={isPending} className="btn btn-secondary">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
}
