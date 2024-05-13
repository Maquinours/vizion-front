import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdPerson } from 'react-icons/md';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createRdv } from '../../../../../../../../utils/api/rdv';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './CreateModal.module.scss';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const routeApi = getRouteApi('/app/tools/scheduler/create');

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

export default function AppViewToolsViewSchedulerViewCreateModalView() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { dates, participant } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: memberOptions, isLoading: isLoadingMemberOptions } = useQuery(queries.profiles.list._ctx.byCategory(CategoryClient.VIZEO));

  const {
    register,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      participants: [],
      dates: [],
    },
  });

  const fullTime = useMemo(() => getValues('fullTime'), [watch('fullTime')]);

  const places = useMemo(
    () => PLACES.filter((place) => place.allowedRoles === undefined || user.userInfo.roles.some((role) => place.allowedRoles.includes(role))),
    [],
  );

  const onClose = () => {
    navigate({ from: routeApi.id, to: '..', search: (old) => ({ ...old, dates: undefined, participant: undefined }) });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ title, description, place, fullTime, participants, dates }: yup.InferType<typeof yupSchema>) =>
      createRdv({
        title,
        description,
        place,
        fullTime,
        userInfoDtos: participants.map((participant) => ({
          attributeToId: participant.id,
          attributeToLastName: participant.lastName ?? '',
          attributeToFirstName: participant.firstName ?? '',
        })),
        startDateTime: dates.at(0)!,
        endDatetime: dates.at(1) ?? new Date(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['rdv-user-infos']._def });
      toast.success('Rendez-vous créé avec succès');
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Une erreur est survenue lors de la création du rendez-vous');
    },
  });

  useEffect(() => {
    if (dates) setValue('dates', dates);
  }, []);

  useEffect(() => {
    if (!!participant && !!memberOptions) {
      const member = memberOptions.find((item) => item.id === participant);
      if (member) setValue('participants', [member]);
    }
  }, [isLoadingMemberOptions]);

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <p>Ajouter un rendez-vous</p>
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
                      {memberOptions?.map((item) => {
                        const isSelected = value?.some((el) => el.id === item.id);
                        return (
                          <div
                            className={classNames(styles.member, {
                              [styles.isSelected]: isSelected,
                            })}
                            key={item.id}
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
                    {places.map((item) => (
                      <option key={item.value} value={item.value}>
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
            <button className="btn btn-primary-light" onClick={onClose}>
              Annuler
            </button>
            <button className="btn btn-secondary" onClick={handleSubmit((data) => mutate(data))}>
              Valider
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
