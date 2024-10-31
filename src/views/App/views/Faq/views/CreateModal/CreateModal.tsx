import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import 'react-multi-email/dist/style.css';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import Quill from '../../../../../../components/Quill/Quill';
import { createFaq } from '../../../../../../utils/api/faq';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { faqs } from '../../../../../../utils/constants/queryKeys/faq';
import FaqAccessLevel from '../../../../../../utils/enums/FaqAccessLevel';
import ProductResponseDto from '../../../../../../utils/types/ProductResponseDto';
import styles from './CreateModal.module.scss';

const routeApi = getRouteApi('/app/faq/create');

const levelOptions = [
  {
    text: 'Choisir le niveau',
    value: undefined,
  },
  {
    text: 'Publique',
    value: FaqAccessLevel.PUBLIC,
  },
  {
    text: 'Interne',
    value: FaqAccessLevel.INTERNE,
  },
  {
    text: 'Professionnel',
    value: FaqAccessLevel.PROFESSIONNEL,
  },
  {
    text: 'Interne IA',
    value: FaqAccessLevel.INTERNE_IA,
  },
  {
    text: 'Publique IA',
    value: FaqAccessLevel.PUBLIC_IA,
  },
];

const yupSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis.').max(255, 'Le problème est trop long.'),
  description: yup.string().required('La description est requise.'),
  level: yup.mixed<FaqAccessLevel>().oneOf(Object.values(FaqAccessLevel)).required('Le niveau est requis'),
  products: yup.array().of(yup.mixed<ProductResponseDto>().required()).nullable(),
});

export default function AppViewFaqViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, description, level, products }: yup.InferType<typeof yupSchema>) =>
      createFaq({
        title,
        description,
        accessLevel: level,
        archived: false,
        productIds: products?.map((product) => product.id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqs._def });
      toast.success('La FAQ a été créée avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création de la FAQ.');
    },
  });

  return (
    <ReactModal
      isOpen={true}
      onRequestClose={onClose}
      shouldCloseOnEsc={!isPending}
      shouldCloseOnOverlayClick={!isPending}
      className={styles.modal}
      overlayClassName="Overlay"
    >
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Ajouter une solution</p>
        </div>
        <div className={styles.content}>
          <div className={styles.inputs_container}>
            <form onSubmit={handleSubmit((data) => mutate(data))} onReset={onClose}>
              <div className={styles.form_content}>
                <div className={styles.form_editor}>
                  <label className={styles.label} htmlFor="title">
                    Problème
                  </label>
                  <Controller control={control} name="title" render={({ field }) => <Quill {...field} />} />
                  <p className={styles.__errors}>{errors.title?.message}</p>
                </div>
                <div className={styles.form_group}>
                  <label className={styles.label} htmlFor="level">
                    {"Niveau d'autorisation"}
                  </label>
                  <select id="level" {...register('level')}>
                    {levelOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.text}
                      </option>
                    ))}
                  </select>
                  <p className={styles.__errors}>{errors.level?.message}</p>
                </div>

                <div className={styles.form_editor}>
                  <label className={styles.label} htmlFor="solution">
                    Solution
                  </label>
                  <Controller control={control} name="description" render={({ field }) => <Quill {...field} />} />
                  <p className={styles.__errors}>{errors.description?.message}</p>
                </div>
                <div className={styles.second_grid}>
                  <div className={styles.form_group}>
                    <label className={styles.label} htmlFor="products">
                      Produits associés
                    </label>
                    <Controller
                      control={control}
                      name="products"
                      render={({ field: { value, onBlur, onChange } }) => (
                        <CustomSelect
                          id="products"
                          placeholder="Sélectionnez un produit"
                          isLoading={isLoadingProducts}
                          options={products}
                          value={value}
                          getOptionLabel={(opt) => opt.reference ?? ''}
                          getOptionValue={(opt) => opt.id}
                          onChange={onChange}
                          onBlur={onBlur}
                          isMulti
                        />
                      )}
                    />
                    <p className={styles.__errors}>{errors.products?.message}</p>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '1rem 0',
                }}
              >
                <PulseLoader color="#31385A" loading={isPending} size={10} speedMultiplier={0.5} />
              </div>
              <div className={styles.form_buttons}>
                <button className="btn btn-primary-light" type="reset">
                  Annuler
                </button>
                <button className="btn btn-secondary" type="submit">
                  Suivant
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
