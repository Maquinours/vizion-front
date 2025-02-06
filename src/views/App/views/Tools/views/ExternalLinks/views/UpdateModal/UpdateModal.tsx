import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import Quill from '../../../../../../../../components/Quill/Quill';
import { updateExternalLink } from '../../../../../../../../utils/api/externalLink';
import { externalLinks } from '../../../../../../../../utils/constants/queryKeys/externalLink';
import ToolAccessLevel from '../../../../../../../../utils/enums/ToolAccessLevel';
import { isValidUrl } from '../../../../../../../../utils/functions/url';
import styles from './UpdateModal.module.scss';

const routeApi = getRouteApi('/app/tools/external-links/update/$externalLinkId');

const levelOptions = [
  {
    text: 'Choisir le niveau',
    value: undefined,
  },
  {
    text: 'Publique',
    value: ToolAccessLevel.PUBLIC,
  },
  {
    text: 'Interne',
    value: ToolAccessLevel.INTERNE,
  },
  {
    text: 'Professionnel',
    value: ToolAccessLevel.PROFESSIONNEL,
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
  level: yup.mixed<ToolAccessLevel>().oneOf(Object.values(ToolAccessLevel), 'Le niveau est requis').required('Le niveau est requis'),
  type: yup.string().nullable(),
  url: yup
    .string()
    .test('is-url-valid', "L'URL n'est pas valide.", (value) => typeof value === 'string' && isValidUrl(value))
    .required("L'url est requis"),
  targetType: yup.string().required('Champs requis'),
});

export default function AppViewToolsViewExternalLinksViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { externalLinkId } = routeApi.useParams();

  const { data: externalLink } = useSuspenseQuery(externalLinks.detail._ctx.byId(externalLinkId));

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      title: externalLink.title,
      description: externalLink.description,
      level: externalLink.accessLevel,
      type: externalLink.type,
      url: externalLink.url ?? '',
      targetType: externalLink.targetType ?? 'INTERN',
    },
  });

  const onClose = () => {
    navigate({ to: '../..', search: true, replace: true, resetScroll: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, description, level, url, type, targetType }: yup.InferType<typeof yupSchema>) =>
      updateExternalLink(externalLink.id, { title, description, accessLevel: level, archived: externalLink.archived, url, type, targetType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: externalLinks._def });
      toast.success('Le lien externe a été modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du lien externe');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.title}>
          <p>Modifier le lien externe</p>
        </div>
        <div className={styles.content}>
          <div className={styles.inputs_container}>
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
                  {levelOptions.map((item, idx) => (
                    <option key={idx} value={item.value}>
                      {item.text}
                    </option>
                  ))}
                </select>
                <p className={styles.__errors}>{errors.level?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="targetType">
                  TARGET
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
                <input type="url" {...register('url')} id="url" />
                <p className={styles.__errors}>{errors.url?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label className={styles.label} htmlFor="type">
                  {"Type d'iframe"}
                </label>
                <select id="type" {...register('type')}>
                  {authorizationTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p className={styles.__errors}>{errors.type?.message}</p>
              </div>

              <div className={styles.form_editor}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { value, onChange, onBlur } }) => <Quill value={value} onChange={onChange} onBlur={onBlur} />}
                />
                <p className={styles.__errors}>{errors.description?.message}</p>

                <div></div>
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
              <button className="btn btn-primary-light" onClick={onClose}>
                Annuler
              </button>
              <button className="btn btn-secondary" onClick={handleSubmit((data) => mutate(data))}>
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
