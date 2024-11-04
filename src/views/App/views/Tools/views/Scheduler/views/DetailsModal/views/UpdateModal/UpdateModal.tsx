import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
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
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  dates: yup
    .array()
    .of(yup.date().required('Champs requis'))
    .required()
    .when('fullTime', {
      is: true,
      then: (schema) => schema.min(1, 'Champs requis'),
      otherwise: (schema) => schema.length(2, 'Champs requis'),
    }),
});

export default function AppViewToolsViewSchedulerViewDetailsModalViewUpdateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { rdvId } = routeApi.useParams();
  const { dates, isAllDay, oldParticipant, newParticipant } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: rdv } = useSuspenseQuery(queries.rdvs.detail(rdvId));

  const { data: memberOptions, isLoading: isLoadingMemberOptions } = useQuery(queries.profiles.list._ctx.byCategory(CategoryClient.VIZEO));

  const {
    register,
    control,
    setValue,
    resetField,
    watch,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      participants: [],
      dates: [],
    },
  });

  const places = useMemo(
    () => PLACES.filter((place) => place.allowedRoles === undefined || user.userInfo.roles.some((role) => place.allowedRoles.includes(role))),
    [],
  );
  const fullTime = useMemo(() => getValues('fullTime'), [watch('fullTime')]);

  const onClose = () => {
    navigate({
      from: routeApi.id,
      to: '..',
      search: (old) => ({ ...old, dates: undefined, isAllDay: undefined, oldParticipant: undefined, newParticipant: undefined }),
      replace: true,
      resetScroll: false,
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ participants, title, description, place, fullTime, dates }: yup.InferType<typeof yupSchema>) =>
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
        startDateTime: dates.at(0)!,
        endDatetime: dates.at(1) ?? new Date(),
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

  useEffect(() => {
    setValue('title', rdv.title);
    if (rdv.description) setValue('description', rdv.description);
    else resetField('description');
    if (rdv.place) setValue('place', rdv.place);
    else resetField('place');
    if (rdv.fullTime) setValue('fullTime', rdv.fullTime);
    else resetField('fullTime');
    setValue('dates', [moment(rdv.startDateTime).toDate(), moment(rdv.endDatetime).toDate()]);
  }, [rdv.id]);

  useEffect(() => {
    if (memberOptions) setValue('participants', memberOptions?.filter((member) => rdv.infos.some((info) => info.attributeToId === member.id)) ?? []);
  }, [isLoadingMemberOptions, rdv.id]);

  useEffect(() => {
    if (dates) setValue('dates', dates);
  }, [dates]);

  useEffect(() => {
    if (!isLoadingMemberOptions && !!memberOptions && oldParticipant && newParticipant) {
      const participants = getValues('participants');
      const oldMemberIndex = participants.findIndex((participant) => participant.id === oldParticipant);
      const newMember = memberOptions.find((member) => member.id === newParticipant);
      if (oldMemberIndex !== -1 && !!newMember) {
        participants.splice(oldMemberIndex, 1, newMember);
        setValue('participants', participants);
      }
    }
  }, [oldParticipant, newParticipant, isLoadingMemberOptions]);

  useEffect(() => {
    if (isAllDay !== undefined) setValue('fullTime', isAllDay);
  }, [isAllDay]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Modifier le rendez-vous</p>
        </div>
        <div className={styles.modal_content}>
          <div className={styles.form}>
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
                            <button
                              type="button"
                              className={styles.icon}
                              onClick={() => onChange(isSelected ? value.filter((el) => el.id !== item.id) : [...value, item])}
                            >
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
              <Controller
                control={control}
                name="dates"
                render={({ field: { value, onChange } }) => {
                  const startDate = value.at(0);
                  const endDate = value.at(1);

                  return (
                    <>
                      <div className={styles.form_custom_group}>
                        <label htmlFor="startDateTime">{fullTime ? 'Date' : 'Date et heure de début'} :</label>
                        <div className={styles.inputs_containers}>
                          <div>
                            <ReactDatePicker
                              id="startDateTime"
                              selected={startDate}
                              selectsStart
                              showTimeSelect={!fullTime}
                              timeFormat="HH:mm"
                              onChange={(date) => onChange([date, endDate])}
                              startDate={startDate}
                              endDate={endDate}
                              locale="fr"
                              dateFormat={fullTime ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm'}
                              isClearable={true}
                            />
                            {errors.dates?.at && <p className={styles.__errors}>{errors.dates.at(0)?.message?.toString()}</p>}
                          </div>
                        </div>
                      </div>
                      {!fullTime && (
                        <div className={styles.form_custom_group}>
                          <label htmlFor="endDateTime">Date et heure de fin :</label>
                          <div className={styles.inputs_containers}>
                            <div>
                              <ReactDatePicker
                                id="endDateTime"
                                selected={endDate}
                                selectsEnd
                                showTimeSelect
                                timeFormat="HH:mm"
                                onChange={(date) => onChange([startDate, date])}
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                filterTime={(time) => !startDate || time > startDate}
                                locale="fr"
                                dateFormat="dd/MM/yyyy HH:mm"
                                isClearable={true}
                              />
                              {errors.dates?.at && <p className={styles.__errors}>{errors.dates.at(1)?.message?.toString()}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                }}
              />
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
          </div>
        </div>

        <div className={styles.modal_loader}>
          <PulseLoader color="#31385A" loading={isPending} className="" size={10} speedMultiplier={0.5} />
        </div>

        <div className={styles.modal_footer}>
          <div className={styles.buttons_container}>
            <button className="btn btn-primary-light" onClick={() => onClose()}>
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
