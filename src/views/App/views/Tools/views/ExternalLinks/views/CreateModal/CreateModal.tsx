import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import * as yup from 'yup';
import styles from './CreateModal.module.scss';
import Quill from '../../../../../../../../components/Quill/Quill';
import { createExternalLink } from '../../../../../../../../utils/api/externalLink';
import { externalLinks } from '../../../../../../../../utils/constants/queryKeys/externalLink';
import { toast } from 'react-toastify';
import FaqAccessLevel from '../../../../../../../../utils/enums/FaqAccessLevel';

const routeApi = getRouteApi('/app/tools/external-links/create');

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
];

const authorizationTypes = [
  {
    label: 'Applique toutes les autorisation',
    value:
      'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation allow-downloads',
  },
  {
    label: 'Permet la soumission de formulaire',
    value: 'allow-forms',
  },
  {
    label: "Permet d'ouvrir des fenêtres modales",
    value: 'allow-modals',
  },
  {
    label: "Permet de verrouiller l'orientation de l'écran",
    value: 'allow-orientation-lock',
  },
  {
    label: "Permet d'utiliser l'API Pointer Lock",
    value: 'allow-pointer-lock',
  },
  {
    label: 'Autorise les fenêtres contextuelles',
    value: 'allow-popups',
  },
  {
    label: "Permet aux popups d'ouvrir de nouvelles fenêtres sans hériter du sandboxing",
    value: 'allow-popups-to-escape-sandbox',
  },
  {
    label: 'Permet de démarrer une session de présentation',
    value: 'allow-presentation',
  },
  {
    label: "Permet au contenu de l'iframe d'être traité comme provenant de la même origine",
    value: 'allow-same-origin',
  },
  {
    label: "Permet d'exécuter des scripts",
    value: 'allow-scripts',
  },
  {
    label: 'Permet au contenu iframe de naviguer dans son contexte de navigation de niveau supérieur',
    value: 'allow-top-navigation',
  },
  {
    label: "Permet au contenu iframe de naviguer dans son contexte de navigation de niveau supérieur, mais uniquement s'il est initié par l'utilisateur",
    value: 'allow-top-navigation-by-user-activation',
  },
  {
    label: "Permet aux téléchargements d'avoir lieu après une action de la part de l'utilisateur.",
    value: 'allow-downloads',
  },
];

const yupSchema = yup.object().shape({
  title: yup.string().required('Le titre est requis.'),
  description: yup.string().required('La description est requise.'),
  level: yup.mixed<FaqAccessLevel>().oneOf(Object.values(FaqAccessLevel), 'Le niveau est requis').required('Le niveau est requis'),
  type: yup.string().nullable(),
  url: yup
    .string()
    .matches(/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/, 'Entrer une URL valide!')
    .required("L'url est requis"),
  targetType: yup.string().required('Champs requis'),
});

export default function AppViewToolsViewExternalLinksViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      targetType: 'INTERN',
    },
  });

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, description, level, url, type, targetType }: yup.InferType<typeof yupSchema>) =>
      createExternalLink({ title, description, accessLevel: level, archived: false, url, type, targetType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: externalLinks._def });
      toast.success('La solution a été ajoutée avec succès');
      onClose();
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Ajouter un lien externe</p>
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
                    {levelOptions.map((item, idx) => {
                      return (
                        <option key={idx} value={item.value}>
                          {item.text}
                        </option>
                      );
                    })}
                  </select>
                  <p className={styles.__errors}>{errors.level?.message}</p>
                </div>

                <div className={styles.form_editor}>
                  <label className={styles.label} htmlFor="solution">
                    Description
                  </label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { value, onChange, onBlur } }) => <Quill value={value} onChange={onChange} onBlur={onBlur} />}
                  />
                  <p className={styles.__errors}>{errors.description?.message}</p>
                </div>
                <div className={styles.second_grid}>
                  <div className={styles.form_group}>
                    <label className={styles.label} htmlFor="targetType">
                      Target
                    </label>
                    <select {...register('targetType')} id="targetType">
                      {[
                        { label: 'VIZION', value: 'INTERN' },
                        { label: 'ORIGINE', value: 'EXTERN' },
                      ].map((el) => (
                        <option key={el.value} value={el.value}>
                          {el.label}
                        </option>
                      ))}
                    </select>
                    <p className={styles.__errors}>{errors.targetType?.message}</p>
                  </div>
                  <div className={styles.form_group}>
                    <label className={styles.label} htmlFor="url">
                      URL
                    </label>
                    <input type="text" {...register('url')} id="url" />
                    <p className={styles.__errors}>{errors.url?.message}</p>
                  </div>
                  <div className={styles.form_group}>
                    <label className={styles.label} htmlFor="type">
                      {"Type d'iframe"}
                    </label>
                    <select id="type" {...register('type')}>
                      {authorizationTypes.map((item, idx) => (
                        <option key={idx} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <p className={styles.__errors}>{errors.type?.message}</p>
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
                <button className="btn btn-primary-light" type="reset">
                  Annuler
                </button>
                <button className="btn btn-secondary" type="submit">
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
