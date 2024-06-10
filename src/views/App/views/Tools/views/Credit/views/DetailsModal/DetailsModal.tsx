import { getRouteApi, useNavigate } from '@tanstack/react-router';
import ReactModal from 'react-modal';
import styles from './DetailsModal.module.scss';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomSelect from '../../../../../../../../components/CustomSelect/CustomSelect';
import { useQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import { useContext } from 'react';
import { CreditContext } from '../../utils/contexts/context';

const routeApi = getRouteApi('/app/tools/credit/details');

const yupSchema = yup.object().shape({
  numBill: yup.string().typeError('').required('Champs requis'),
  billNumBusiness: yup.string().typeError('').required('Champs requis'),
  billNumOrder: yup.string().typeError('').required('Champs requis'),
  billingCompany: yup.mixed<EnterpriseResponseDto>().typeError('').required('Champs requis'),
  billingContact: yup.mixed<ProfileResponseDto>().typeError('').required('Champs requis'),
  deliveryAddressCompanyName: yup.string().typeError('').required('Champs requis'),
  deliveryAddressFullName: yup.string().typeError('').required('Champs requis'),
  deliveryAddressOne: yup.string().typeError('').required('Champs requis'),
  deliveryAddressTwo: yup.string().typeError('').nullable(),
  deliveryAddressZipCode: yup.string().typeError('').required('Champs requis'),
  deliveryAddressCity: yup.string().typeError('').required('Champs requis'),
  deliveryAddressEmail: yup.string().typeError('').nullable(),
  deliveryAddressPhoneNumber: yup.string().typeError('').nullable(),
});

export default function AppViewToolsViewCreditViewDetailsModalView() {
  const navigate = useNavigate({ from: routeApi.id });

  const { setDetails } = useContext(CreditContext)!;

  const { data: enterprises, isLoading: isLoadingEnterprises } = useQuery(queries.enterprise.list);

  const {
    register,
    control,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onClose = () => {
    navigate({ to: '..', search: (old) => old, replace: true, resetScroll: false });
  };

  const onSaveDetails = (data: yup.InferType<typeof yupSchema>) => {
    setDetails(data);
    onClose();
  };

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>{"Détails de l'avoir"}</h6>
        </div>
        <div className={styles.modal_content}>
          <form onSubmit={handleSubmit(onSaveDetails)} onReset={onClose}>
            <div className={styles.form_group}>
              <label htmlFor="billNumBusiness">{"Numéro d'affaire :"}</label>
              <input id="billNumBusiness" {...register('billNumBusiness')} />
              <p className={styles._errors}>{errors.billNumBusiness?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="numBill">Numéro de facture :</label>
              <input id="numBill" {...register('numBill')} />
              <p className={styles._errors}>{errors.numBill?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billNumOrder">Numéro de commande :</label>
              <input id="billNumOrder" {...register('billNumOrder')} />
              <p className={styles._errors}>{errors.billNumOrder?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingCompany">Entreprise</label>
              <div className={styles.react_select_custom}>
                <Controller
                  control={control}
                  name="billingCompany"
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
              <p className={styles._errors}>{errors.billingCompany?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="billingContact">Contact</label>
              <Controller
                control={control}
                name="billingContact"
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    options={watch('billingCompany')?.profiles ?? []}
                    getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
                    getOptionValue={(opt) => opt.id}
                    placeholder="Sélectionnez un contact"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <p className={styles._errors}>{errors.billingContact?.message}</p>
            </div>

            <hr style={{ margin: '2rem 0' }} />
            <h3
              style={{
                marginBottom: '10px',
                color: 'var(--primary-color)',
                fontSize: '17px',
                fontWeight: 'bold',
              }}
            >
              Adresse de livraison
            </h3>
            <div className={styles.form_group}>
              <label htmlFor="deliveryAddressCompanyName">Société :</label>
              <input id="deliveryAddressCompanyName" {...register('deliveryAddressCompanyName')} />
              <p className={styles._errors}>{errors.deliveryAddressCompanyName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="deliveryAddressFullName">Nom complet :</label>
              <input id="deliveryAddressFullName" {...register('deliveryAddressFullName')} />
              <p className={styles._errors}>{errors.deliveryAddressFullName?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="deliveryAddressOne">Adresse 1 :</label>
              <input id="deliveryAddressOne" {...register('deliveryAddressOne')} />
              <p className={styles._errors}>{errors.deliveryAddressOne?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="deliveryAddressTwo">Adresse 2 :</label>
              <input id="deliveryAddressTwo" {...register('deliveryAddressTwo')} />
              <p className={styles._errors}>{errors.deliveryAddressTwo?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="deliveryAddressZipCode">Code postal :</label>
              <input id="deliveryAddressZipCode" {...register('deliveryAddressZipCode')} />
              <p className={styles._errors}>{errors.deliveryAddressZipCode?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="deliveryAddressCity">Ville :</label>
              <input id="deliveryAddressCity" {...register('deliveryAddressCity')} />
              <p className={styles._errors}>{errors.deliveryAddressCity?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="deliveryAddressEmail">Email :</label>
              <input id="deliveryAddressEmail" {...register('deliveryAddressEmail')} />
              <p className={styles._errors}>{errors.deliveryAddressEmail?.message}</p>
            </div>
            <div className={styles.form_group}>
              <label htmlFor="deliveryAddressPhoneNumber">Téléphone :</label>
              <input id="deliveryAddressPhoneNumber" {...register('deliveryAddressPhoneNumber')} />
              <p className={styles._errors}>{errors.deliveryAddressPhoneNumber?.message}</p>
            </div>

            <div className={styles.form_buttons}>
              <button type="reset" className="btn btn-primary">
                Fermer
              </button>
              <button type="submit" className="btn btn-secondary">
                Valider
              </button>
            </div>
          </form>
        </div>
      </div>
    </ReactModal>
  );
}
