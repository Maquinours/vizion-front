import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdPerson } from 'react-icons/md';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import ReactModal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { createLifesheet } from '../../utils/api/lifesheet';
import { queries } from '../../utils/constants/queryKeys';
import { businesses } from '../../utils/constants/queryKeys/business';
import { enterprises } from '../../utils/constants/queryKeys/enterprise';
import { lifesheets } from '../../utils/constants/queryKeys/lifesheet';
import CategoryClient from '../../utils/enums/CategoryClient';
import { LifesheetAssociatedItem } from '../../utils/enums/LifesheetAssociatedItem';
import LifeSheetRequestDto from '../../utils/types/LifeSheetRequestDto';
import ProfileResponseDto from '../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../views/App/utils/functions/getAuthentifiedUser';
import Quill from '../Quill/Quill';
import styles from './CreateLifesheetModal.module.scss';

const yupSchema = yup.object({
  description: yup.string().required('Ce champ est requis'),
  deadline: yup.date(),
  receivers: yup.array().of(yup.mixed<ProfileResponseDto>().required()).required(),
});

type CreateLifesheetModalComponentProps = Readonly<{
  associatedItemType: LifesheetAssociatedItem;
  associatedItemId: string;
  onClose: () => void;
}>;
export default function CreateLifesheetModalComponent({ associatedItemType, associatedItemId, onClose }: CreateLifesheetModalComponentProps) {
  const queryClient = useQueryClient();

  const [showPredefinedTexts, setShowPredefinedTexts] = useState(false);

  const { data: currentUser } = useAuthentifiedUserQuery();

  const { data: predefinedTexts } = useQuery(queries['predefined-text'].list);

  const { data: vizeoMembers } = useQuery(queries.enterprise.list._ctx.byCategory(CategoryClient.VIZEO)._ctx.profiles._ctx.list);

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      receivers: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ receivers, description, deadline }: yup.InferType<typeof yupSchema>) => {
      let data: Partial<LifeSheetRequestDto> = {};
      switch (associatedItemType) {
        case LifesheetAssociatedItem.PRODUCT:
          data = {
            productId: associatedItemId,
            productReference: (await queryClient.ensureQueryData(queries.product.detail(associatedItemId))).reference,
          };
          break;
        case LifesheetAssociatedItem.ENTERPRISE:
          data = {
            enterpriseId: associatedItemId,
            enterpriseName: (await queryClient.ensureQueryData(enterprises.detail(associatedItemId))).name,
          };
          break;
        case LifesheetAssociatedItem.RMA:
          data = {
            rmaId: associatedItemId,
            rmaNumber: (await queryClient.ensureQueryData(queries.rmas.detail(associatedItemId))).number,
          };
          break;
        case LifesheetAssociatedItem.ASSISTANCE:
          data = { technicalSupportId: associatedItemId };
          break;
        case LifesheetAssociatedItem.BUSINESS:
          data = {
            businessId: associatedItemId,
            businessNumber: (await queryClient.ensureQueryData(businesses.detail._ctx.byId(associatedItemId))).numBusiness,
          };
          break;
      }
      return createLifesheet({
        receiver: receivers.map((receiver) => `${receiver.firstName?.split(' ').at(0)} ${receiver.lastName?.charAt(0)}.`).join('; '),
        name: `${currentUser.userInfo.firstName.split(' ')[0]} ${currentUser.userInfo.lastName.charAt(0)}.`,
        description,
        ...data,
        tasksDtoList: receivers.map((receiver) => ({
          name: `${receiver.firstName?.split(' ').at(0)} ${receiver.lastName?.at(0)}.`,
          deadline,
          profileId: receiver.id,
          enterpriseId: data.enterpriseId,
          enterpriseName: data.enterpriseName,
          productId: data.productId,
          reference: data.productReference,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lifesheets._def });
      toast.success('Commentaire de fiche de vie créée avec succès');
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast.error('Une erreur est survenue lors de la création du commentaire de la fiche de vie');
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.title_container}>
          <p>Fiche de vie</p>
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <p>Ajouter un commentaire dans la fiche de vie </p>
          </div>
          <div className={styles.button_container_container}>
            <div
              className={styles.button_container}
              onMouseOver={() => setShowPredefinedTexts(true)}
              onFocus={() => setShowPredefinedTexts(true)}
              onMouseLeave={() => setShowPredefinedTexts(false)}
            >
              <button className="btn btn-primary">
                Textes prédéfinis {showPredefinedTexts ? <RiArrowDropUpLine size="25" /> : <RiArrowDropDownLine size="25" />}
              </button>
              {showPredefinedTexts && (
                <div className={styles.text_container}>
                  {predefinedTexts?.map((itm, idx) => (
                    <button className={styles.text} key={idx} onClick={() => setValue('description', watch('description') + itm.description)}>
                      {itm.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className={styles.editor}>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value, onBlur } }) => (
                  <Quill placeholder="Ecrire le message ici" value={value} onChange={onChange} onBlur={onBlur} />
                )}
              />
              <p className="__errors">{errors.description?.message}</p>
            </div>

            <div className={styles.members_container}>
              <p>Mettre en charge à :</p>

              <div className={styles.members_section}>
                {vizeoMembers?.map((itm) => {
                  const isSelected = watch('receivers').some((receiver) => receiver.id === itm.id);

                  return (
                    <button
                      key={itm.id}
                      className={classNames(styles.member_card, {
                        [styles.isSelected]: isSelected,
                      })}
                      onClick={() =>
                        setValue('receivers', isSelected ? watch('receivers').filter((receiver) => receiver.id !== itm.id) : [...watch('receivers'), itm])
                      }
                    >
                      <MdPerson color="#16204E" height="50" width="50" className={styles.icon} />
                      <div className={styles.avatar}>
                        {itm.firstName?.split(' ').at(0)} {itm.lastName?.charAt(0)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.choose_date}>
              <div className={styles.form_group}>
                <label htmlFor="lifeSheetDeadline">{"Date d'échéance :"}</label>
                <input name="lifeSheetDeadline" id="lifeSheetDeadline" type="date" />
                <p className={styles.__errors}></p>
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

            <div className={styles.footer_buttons}>
              <button className="btn btn-primary" onClick={() => onClose()}>
                Annuler
              </button>
              <button className="btn btn-secondary">Valider</button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
