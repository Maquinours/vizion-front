import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../components/Quill/Quill';
import { createFaq } from '../../../../../../utils/api/faq';
import { faqs } from '../../../../../../utils/constants/queryKeys/faq';
import FaqAccessLevel from '../../../../../../utils/enums/FaqAccessLevel';
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
  title: yup.string().required('Le titre est requis.'),
  description: yup.string().required('La description est requise.'),
  level: yup.mixed<FaqAccessLevel>().oneOf(Object.values(FaqAccessLevel)).required('Le niveau est requis'),
  concerneds: yup.array().of(yup.string().required()).min(1, 'Au moins un mot clé est requis').required('Les mots clés sont requis'),
});

export default function AppViewFaqViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, description, level, concerneds }: yup.InferType<typeof yupSchema>) =>
      createFaq({
        title,
        description,
        accessLevel: level,
        archived: false,
        faqConcernedNames: concerneds,
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
                    <label className={styles.label} htmlFor="concerned">
                      Mots-clés
                    </label>
                    <Controller
                      control={control}
                      name="concerneds"
                      render={({ field: { value, onBlur, onChange } }) => (
                        <ReactMultiEmail
                          emails={value}
                          className={styles.multi_email}
                          onChange={onChange}
                          onBlur={onBlur}
                          delimiter="[,;]"
                          getLabel={(value, index, removeItem) => (
                            <div data-tag key={index}>
                              <div data-tag-item>{value}</div>
                              <button type="button" data-tag-handle onClick={() => removeItem(index)}>
                                ×
                              </button>
                            </div>
                          )}
                          validateEmail={() => true}
                        />
                      )}
                    />
                    <p className={styles.__errors}>{errors.concerneds?.message}</p>
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
