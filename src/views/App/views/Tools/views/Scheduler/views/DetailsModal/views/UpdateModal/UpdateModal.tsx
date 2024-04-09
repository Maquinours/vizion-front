import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import classNames from 'classnames';
import moment from 'moment';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdPerson } from 'react-icons/md';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateRdv } from '../../../../../../../../../../utils/api/rdv';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../../../../../utils/enums/CategoryClient';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './UpdateModal.module.scss';

const routeApi = getRouteApi('/app/tools/scheduler/details/$rdvId/update');

const PLACES = [
  {
    label: 'VIZEO',
    value: 'VIZEO',
  },
  {
    label: 'Extérieur',
    value: 'Extérieur',
  },
  {
    label: 'Maladie',
    value: 'Maladie',
  },
  {
    label: 'Congés',
    value: 'Congés',
    allowedRoles: ['ROLE_DIRECTION_VIZEO'],
  },
  {
    label: 'Absence',
    value: 'Absence',
  },
  {
    label: 'Férié',
    value: 'Férié',
  },
  {
    label: 'Rdv Téléphonique',
    value: 'RdV Téléphonique',
  },
  {
    label: 'Show room',
    value: 'Show room',
  },
];

const yupSchema = yup.object().shape({
  participants: yup
    .array()
    .typeError('Faites un choix')
    .of(yup.mixed<ProfileResponseDto>().required())
    .min(1, 'Au moins un participant')
    .required('Champs requis'),
  title: yup.string().required('Champs requis'),
  description: yup.string().required('Champs requis'),
  place: yup.string().required('Champs requis'),
  fullTime: yup.boolean().required('Champs requis'),
  startDateTime: yup.date().required('Champs requis'),
  endDateTime: yup
    .date()
    .nullable()
    .when('fullTime', {
      is: true,
      then: () => yup.date().required('Champs requis'),
    }),
});

export default function AppViewToolsViewSchedulerViewDetailsModalViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { rdvId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: rdv } = useSuspenseQuery(queries.rdvs.detail(rdvId));

  const { data: memberOptions } = useSuspenseQuery(queries.profiles.list._ctx.byCategory(CategoryClient.VIZEO));

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      participants: memberOptions.filter((member) => rdv.infos.some((info) => info.attributeToId === member.id)),
      title: rdv.title,
      description: rdv.description ?? '',
      place: rdv.place ?? undefined,
      fullTime: rdv.fullTime ?? undefined,
      startDateTime: moment(rdv.startDateTime).toDate(),
      endDateTime: moment(rdv.endDatetime).toDate(),
    },
  });

  const places = useMemo(
    () => PLACES.filter((place) => place.allowedRoles === undefined || user.userInfo.roles.some((role) => place.allowedRoles.includes(role))),
    [],
  );

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => old });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ participants, title, description, place, fullTime, startDateTime, endDateTime }: yup.InferType<typeof yupSchema>) =>
      updateRdv(rdv.id, {
        userInfoDtos: participants.map((participant) => ({
          attributeToId: participant.id,
          attributeToFirstName: participant.firstName,
          attributeToLastName: participant.lastName,
        })),
        title,
        description,
        place,
        fullTime,
        startDateTime,
        endDatetime: endDateTime ?? new Date(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.rdvs._def });
      toast.success('Rendez-vous modifié avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la modification du rendez-vous');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Modifier le rendez-vous</p>
        </div>
        <div className={styles.modal_content}>
          <form>
            <div className={styles.form_content}>
              <div className={styles.attribute_content}>
                <div className={styles.title}>Attribué à :</div>
                <Controller
                  control={control}
                  name="participants"
                  render={({ field: { value, onChange } }) => (
                    <div className={styles.members_container}>
                      {memberOptions?.map((item, key) => {
                        const isSelected = value?.some((el) => el.id === item.id);
                        return (
                          <div
                            className={classNames(styles.member, {
                              [styles.isSelected]: isSelected,
                            })}
                            key={key}
                          >
                            <button className={styles.icon} onClick={() => onChange(isSelected ? value.filter((el) => el.id !== item.id) : [...value, item])}>
                              <MdPerson color="#16204E" />
                            </button>
                            <div className={styles.name}>
                              {item.firstName} {item.lastName?.charAt(0)}.
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
                <div className={styles.member_error}>{errors.participants && <p className={styles.__errors}>{errors.participants.message}</p>}</div>
              </div>
              <div className={styles.form_custom_group}>
                <label htmlFor="startDateTime">Date et heure de début :</label>
                <div className={styles.inputs_containers}>
                  <div>
                    <input type="datetime-local" min={new Date().toISOString().slice(0, -8)} id="startDateTime" {...register('startDateTime')} />
                    {errors.startDateTime && <p className={styles.__errors}>{errors.startDateTime.message}</p>}
                  </div>
                </div>
              </div>
              <div className={styles.form_custom_group}>
                <label htmlFor="endDateTime">Date et heure de fin :</label>
                <div className={styles.inputs_containers}>
                  <div>
                    <input type="datetime-local" min={new Date().toISOString().slice(0, -8)} id="endDateTime" {...register('endDateTime')} />
                    {errors.endDateTime && <p className={styles.__errors}>{errors.endDateTime.message}</p>}
                  </div>
                </div>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="fullTime">Journée complète :</label>
                <div>
                  <input type="checkbox" id="fullTime" {...register('fullTime')} />
                  {errors.fullTime && <p className={styles.__errors}>{errors.fullTime.message}</p>}
                </div>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="place">Lieu :</label>
                <div>
                  <select defaultValue={'Extérieur'} id="place" {...register('place')}>
                    {places.map((item, key) => (
                      <option key={key} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  {errors.place && <p className={styles.__errors}>{errors.place.message}</p>}
                </div>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="title">Titre :</label>
                <div>
                  <input type="text" placeholder="Nom du RDV" id="title" {...register('title')} />
                  {errors.title && <p className={styles.__errors}>{errors.title.message}</p>}
                </div>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="description">Description :</label>
                <div>
                  <textarea placeholder="Description du RDV" rows={8} id="description" {...register('description')} />
                  {errors.description && <p className={styles.__errors}>{errors.description.message}</p>}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className={styles.modal_loader}>
          <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
        </div>

        <div className={styles.modal_footer}>
          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" onClick={() => onClose}>
              Annuler
            </button>
            <button className="btn btn-secondary" onClick={handleSubmit((data) => mutate(data))}>
              Modifier
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
