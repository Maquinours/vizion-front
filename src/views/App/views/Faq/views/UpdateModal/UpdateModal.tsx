import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import 'react-multi-email/dist/style.css';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import CustomSelect from '../../../../../../components/CustomSelect/CustomSelect';
import Quill from '../../../../../../components/Quill/Quill';
import { updateFaq } from '../../../../../../utils/api/faq';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { faqs } from '../../../../../../utils/constants/queryKeys/faq';
import FaqAccessLevel from '../../../../../../utils/enums/FaqAccessLevel';
import styles from './UpdateModal.module.scss';

const yupSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis.'),
  description: yup.string().required('La description est requise.'),
  level: yup.mixed<FaqAccessLevel>().oneOf(Object.values(FaqAccessLevel)).required('Le niveau est requis'),
  products: yup.array().of(yup.mixed<{ id: string; reference: string | null }>().required()).nullable(),
});

const routeApi = getRouteApi('/app/faq/update/$faqId');

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

export default function AppViewFaqViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { faqId } = routeApi.useParams();

  const { data: faq } = useSuspenseQuery(faqs.detail._ctx.byId(faqId));
  const { data: products, isLoading: isLoadingProducts } = useQuery(queries.product.list);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      title: faq.title,
      description: faq.description,
      level: faq.accessLevel,
      products: faq.products ?? [],
    },
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '../..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, description, level, products }: yup.InferType<typeof yupSchema>) =>
      updateFaq(faq.id, { title, description, accessLevel: level, products: products?.map((product) => product.id), archived: faq.archived }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqs._def });
      toast.success('La FAQ a été modifiée avec succès.');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Erreur lors de la modification de la FAQ.');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Modifier la solution</p>
        </div>
        <div className={styles.content}>
          <div className={styles.inputs_container}>
            <form onSubmit={handleSubmit((data) => mutate(data))}>
              <div className={styles.form_content}>
                <div className={styles.form_group}>
                  <label className={styles.label} htmlFor="title">
                    Titre
                  </label>
                  <input type="text" {...register('title')} id="title" />
                  <p className={styles.__errors}>{errors.title?.message}</p>
                </div>
                <div className={styles.form_group}>
                  <label className={styles.label} htmlFor="level">
                    {"Niveau d'autorisation"}
                  </label>
                  <select id="level" {...register('level')}>
                    {levelOptions.map((item) => {
                      return (
                        <option key={item.value} value={item.value}>
                          {item.text}
                        </option>
                      );
                    })}
                  </select>
                  <p className={styles.__errors}>{errors.level?.message}</p>
                </div>

                <div className={styles.form_editor}>
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
                <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
              </div>
              <div className={styles.form_buttons}>
                <button type="button" className="btn btn-primary-light" onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-secondary">
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
