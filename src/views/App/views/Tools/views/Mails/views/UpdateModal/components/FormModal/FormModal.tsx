import * as yup from 'yup';
import EnterpriseResponseDto from '../../../../../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import styles from './FormModal.module.scss';
import CustomSelect from '../../../../../../../../../../components/CustomSelect/CustomSelect';
import ReactModal from 'react-modal';
import MailPaperResponseDto from '../../../../../../../../../../utils/types/MailPaperResponseDto';

const yupSchema = yup.object().shape({
  enterprise: yup.mixed<EnterpriseResponseDto>().required('Champs requis.'),
  contact: yup.mixed<ProfileResponseDto>().required('Champs requis.'),
  object: yup.string().required('Champs requis'),
  city: yup.string().required('Champs requis'),
  zipCode: yup.string().required('Champs requis'),
  addressOne: yup.string().required('Champs requis'),
  addressTwo: yup.string().nullable(),
  sections: yup
    .array()
    .of(yup.object().shape({ content: yup.string().required() }).required())
    .required(),
});

export type UpdateMailFormType = yup.InferType<typeof yupSchema>;

type AppViewToolsViewMailsViewUpdateModalViewFormModalComponentProps = Readonly<{
  show: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateMailFormType) => void;
  mail: MailPaperResponseDto;
}>;
export default function AppViewToolsViewMailsViewUpdateModalViewFormModalComponent({
  show,
  onClose,
  onSubmit,
  mail,
}: AppViewToolsViewMailsViewUpdateModalViewFormModalComponentProps) {
  const { data: enterprises, isLoading: isLoadingEnterprises } = useQuery(queries.enterprise.list);

  const {
    register,
    control,
    setValue,
    resetField,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      addressOne: mail.addressLineOne,
      addressTwo: mail.addressLineTwo,
      city: mail.city ?? undefined,
      zipCode: mail.zipCode,
      object: mail.subject ?? undefined,
      sections: Object.values(mail.content).map((content) => ({ content: typeof content === 'string' ? content : '' })),
    },
  });

  const {
    fields: sections,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: 'sections',
  });

  const enterprise = useWatch({ name: 'enterprise', control });

  useEffect(() => {
    if (!enterprise) return;
    if (enterprise.profiles.length === 1) setValue('contact', enterprise.profiles[0]);
    else resetField('contact');
    setValue('addressOne', enterprise.addressLineOne);
    setValue('addressTwo', enterprise.addressLineTwo);
    setValue('zipCode', enterprise.zipCode);
    setValue('city', enterprise.city ?? '');
  }, [enterprise]);

  useEffect(() => {
    if (enterprises) {
      const enterprise = enterprises.find((enterprise) => enterprise.name === mail.enterpriseName);
      if (enterprise) {
        setValue('enterprise', enterprise);
        const contact = enterprise.profiles.find((profile) => profile.email === mail.profileEmail);
        if (contact) setValue('contact', contact);
      }
    }
  }, [isLoadingEnterprises]);

  return (
    <ReactModal isOpen={show} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.container}>
        <div className={styles.header}>
          <button className="btn btn-secondary" onClick={handleSubmit(onSubmit)}>
            Créer un courrier
          </button>
        </div>

        <div className={styles.mail_container}>
          <div className={styles.content}>
            <div className={styles.grid_one}>
              <div className={styles.form_group}>
                <label htmlFor="enterprise">Entreprise</label>
                <div className={styles.react_select_custom}>
                  <Controller
                    control={control}
                    name="enterprise"
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        options={enterprises}
                        isLoading={isLoadingEnterprises}
                        getOptionLabel={(opt) => opt.name}
                        getOptionValue={(opt) => opt.id}
                        placeholder="Sélectionnez une entreprise"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
                <p className={styles.__errors}>{errors.enterprise?.message}</p>
              </div>
              <div className={styles.form_group}>
                <label htmlFor="contact">Contact</label>
                <Controller
                  control={control}
                  name="contact"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      options={enterprise?.profiles}
                      getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
                      getOptionValue={(opt) => opt.id}
                      placeholder="Sélectionnez une entreprise"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                <p className={styles.__errors}>{errors.contact?.message}</p>
              </div>
              <div className={styles.form_group}>
                <input placeholder="Adresse 1" id="addressOne" {...register('addressOne')} />
                <p className={styles.__errors}>{errors.addressOne?.message}</p>
              </div>
              <div className={styles.form_group}>
                <input placeholder="Adresse 2" id="addressTwo" {...register('addressTwo')} />
                <p className={styles.__errors}>{errors.addressTwo?.message}</p>
              </div>
              <div className={styles.form_group}>
                <input placeholder="Code postal" id="zipCode" {...register('zipCode')} />
                <p className={styles.__errors}>{errors.zipCode?.message}</p>
              </div>
              <div className={styles.form_group}>
                <input placeholder="Ville" id="city" {...register('city')} />
                <p className={styles.__errors}>{errors.city?.message}</p>
              </div>
            </div>
            <div className={styles.grid_two}>
              <div className={styles.header}>
                <div className={styles.header_form}>
                  <input placeholder="Objet" id="object" {...register('object')} />
                  <p className={styles.__errors}>{errors.object?.message}</p>
                </div>
                <button className="btn btn-primary" onClick={() => appendSection({ content: '' })}>
                  Ajouter une section
                </button>
              </div>
              <div className={styles.body_container}>
                {sections.map((field, index) => (
                  <div key={field.id} className={styles.body_item}>
                    <textarea
                      key={field.id}
                      rows={10}
                      {...register(`sections.${index}.content`, {
                        required: true,
                      })}
                    />
                    {sections.length > 1 && (
                      <button className="btn btn-primary" onClick={() => removeSection(index)}>
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
