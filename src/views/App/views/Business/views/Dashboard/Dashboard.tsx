import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, getRouteApi } from '@tanstack/react-router';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import WorkloadsComponent from '../../../../../../components/Workloads/Workloads';
import { updateBusiness } from '../../../../../../utils/api/business';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../utils/enums/BusinessState';
import { WorkloadAssociatedItem } from '../../../../../../utils/enums/WorkloadAssociatedItem';
import { useAuthentifiedUserQuery } from '../../../../utils/functions/getAuthentifiedUser';
import styles from './Dashboard.module.scss';
import AppViewBusinessViewDashboardViewBillingAddressComponent from './components/BillingAddress/BillingAddress';
import AppViewBusinessViewDashboardViewDatesDataComponent from './components/DatesData/DatesData';
import AppViewBusinessViewDashboardViewDeliveryAddressComponent from './components/DeliveryAddress/DeliveryAddress';
import AppViewBusinessViewDashboardViewGedComponent from './components/Ged/Ged';
import AppViewBusinessViewDashboardViewGeneralInformationsComponent from './components/GeneralInformations/GeneralInformations';
import AppViewBusinessViewDashboardViewImportOtherBusinessQuotationComponent from './components/ImportOtherBusinessQuotation/ImportOtherBusinessQuotation';
import AppViewBusinessViewDashboardViewLifesheetComponent from './components/Lifesheet/Lifesheet';
import AppViewBusinessViewDashboardViewLinksComponent from './components/Links/Links';
import AppViewBusinessViewDashboardViewQuotationButtonComponent from './components/QuotationButton/QuotationButton';
import AppViewBusinessViewDashboardViewResponsibleComponent from './components/Responsible/Responsible';
import AppViewBusinessViewDashboardViewTransferDataButtonComponent from './components/TransferDataButton/TransferDataButton';
import { BusinessDashboardContext } from './utils/contexts/context';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

const yupSchema = yup.object({
  businessName: yup.string().required('Champs requis.'),
  businessInstaller: yup.string().nullable(),
  businessExport: yup.string().required('Champs requis.'),
  businessDeliveryMode: yup.string().nullable(),
  receiverName: yup.string().nullable(),
  receiverCompanyName: yup.string().nullable(),
  receiverAddressTwo: yup.string().nullable(),
  receiverAddressOne: yup.string().nullable(),
  receiverZipCode: yup.string().nullable(),
  receiverCity: yup.string().nullable(),
  receiverPhoneNumber: yup.string().nullable(),
  receiverEmail: yup.string().email('Email invalide').nullable(),
});

export type BusinessDashboardFormType = yup.InferType<typeof yupSchema>;

export default function AppViewBusinessViewDashboardView() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      businessName: business.title ?? '',
      businessInstaller: business.installerProfileName ?? '',
      businessExport: business.exportTva ? 'yes' : 'no',
      businessDeliveryMode: business.deliveryMode ?? null,
      receiverCompanyName: business.deliverAddressCompany ?? '',
      receiverName: business.deliverAddressName ?? '',
      receiverAddressOne: business.deliverAddressOne ?? '',
      receiverAddressTwo: business.deliverAddressTwo ?? '',
      receiverZipCode: business.deliverAddressZipCode ?? '',
      receiverCity: business.deliverAddressCity ?? '',
      receiverPhoneNumber: business.deliverPhoneNumber ?? '',
      receiverEmail: business.deliverEmail ?? '',
    },
  });

  const contextValue = useMemo(() => ({ setValue }), [setValue]);

  const copyBusinessNumber = () => {
    navigator.clipboard
      .writeText(business.numBusiness)
      .then(() => {
        toast.success("Numéro de l'affaire copié");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Erreur lors de la copie du numéro de l'affaire");
      });
  };

  const { mutate: save, isPending: isSavePending } = useMutation({
    mutationFn: async (data: BusinessDashboardFormType) => {
      const possibleDepartmentCodes = [data.receiverZipCode?.toString().trim().slice(0, 2), data?.businessInstaller?.toString().trim().slice(0, 3)];
      const representative = (await queryClient.ensureQueryData(queries.departments.list)).find((department) =>
        possibleDepartmentCodes.includes(department.code),
      )?.repEnterprise;
      return updateBusiness(business.id, {
        title: data.businessName,
        billingAddressOne: business.billingAddressOne,
        billingAddressTwo: business.billingAddressTwo,
        billingZipCode: business.billingZipCode!,
        billingCity: business.billingCity,
        billingCompany: business.billingCompany!,
        billingName: business.billingName,
        billingDepartmentCode: business.billingZipCode?.toString().trim().slice(0, 2),
        billingPhoneNumber: business.billingPhoneNumber,
        billingEmail: business.billingEmail,
        deliveryDepartmentCode: data.receiverZipCode?.toString().trim().slice(0, 2),
        deliverAddressOne: data.receiverAddressOne,
        deliverAddressTwo: data.receiverAddressTwo,
        deliverAddressZipCode: data.receiverZipCode?.toString().trim(),
        deliverAddressCity: data.receiverCity,
        deliverPhoneNumber: data.receiverPhoneNumber,
        deliverAddressCompany: data.receiverCompanyName,
        deliverAddressName: data.receiverName,
        deliverEmail: data.receiverEmail,
        enterpriseId: business.enterpriseId,
        enterpriseName: business.enterpriseName,
        enterpriseCategory: business.enterpriseCategory,
        reduction: business.reduction ?? 0,
        representativeId: representative?.id,
        representativeName: representative?.name,
        representativeZipCode: representative?.zipCode,
        zipCode: data.receiverZipCode,
        profileId: business.profileId,
        profileName: business.profileName,
        profileEmail: business.profileEmail,
        profilePhone: business.profilePhone,
        exportTva: data.businessExport === 'yes',
        billAndLock: false,
        deliveryMode: data.businessDeliveryMode,
        installerProfileId: business.installerProfileId,
        installerProfileName: data.businessInstaller,
        installerProfileEmail: business.installerProfileEmail,
        type: business.type!,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      toast.success('Les modifications ont été enregistrées');
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'enregistrement des modifications");
    },
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headers_buttons}>
          {(business.state === BusinessState.DEVIS || business.state === BusinessState.CREATED) && !business.archived && (
            <Link from={routeApi.id} to="delete" search={(old) => old} replace resetScroll={false} className="btn btn-secondary">
              <FaTrash color="#FFF" width={14} height={14} />
              Supprimer cette affaire
            </Link>
          )}
          <button className={styles.business_number} onClick={copyBusinessNumber}>
            {business.numBusiness}
          </button>

          {!business.archived && (
            <div className={styles.right_buttons}>
              {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                <Link from={routeApi.id} to="send-email" search={(old) => old} replace resetScroll={false} className="btn btn-primary">
                  Envoyer un mail
                </Link>
              )}
              {(business.state === null ||
                ![BusinessState.FACTURE, BusinessState.ARC, BusinessState.BP, BusinessState.BL].includes(business.state) ||
                user.userInfo.roles.find((role) => ['ROLE_VIZEO', 'ROLE_DIRECTION_VIZEO', 'ROLE_STAGIAIRE_VIZEO'].includes(role))) && (
                <button className="btn btn-secondary" disabled={isSavePending} onClick={handleSubmit((data) => save(data))}>
                  {isSavePending ? 'Sauvegarde en cours...' : 'Sauvegarder'}
                </button>
              )}
              {/* <Link to={`/app/businesses/business-study/${business.id}`} className="btn btn-secondary">
                {"Accès à l'étude"} TODO: Reimplement this
              </Link> */}
              <AppViewBusinessViewDashboardViewQuotationButtonComponent />
            </div>
          )}
        </div>
        <AppViewBusinessViewDashboardViewDatesDataComponent />

        <div
          className={classNames(styles.content_grid, {
            [styles.two_grid]: user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'),
            [styles.unique_grid]: !user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'),
          })}
        >
          {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && <AppViewBusinessViewDashboardViewLifesheetComponent />}
          <div className={styles.second_grid}>
            <AppViewBusinessViewDashboardViewGeneralInformationsComponent
              register={register}
              errors={errors}
              onSave={handleSubmit((data) => save(data))}
              isSavePending={isSavePending}
            />
            <div className={styles.address_sections}>
              <div>
                <div className={styles.enterprise_category}>
                  <p>
                    Catégorie : <span>{business.enterpriseCategory}</span>
                  </p>
                </div>
                <div>
                  {user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && (
                    <Link
                      from={routeApi.id}
                      to="update-representative"
                      search={(old) => old}
                      replace
                      resetScroll={false}
                      className="btn btn-primary"
                      style={{ marginRight: '10px' }}
                    >
                      Modifier le représentant
                    </Link>
                  )}
                  <Link from={routeApi.id} to="address-book" search={(old) => old} replace resetScroll={false} className="btn btn-primary">
                    Carnet d&apos;adresse
                  </Link>
                </div>
              </div>
              <div>
                {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                  <WorkloadsComponent
                    associatedItemType={WorkloadAssociatedItem.BUSINESS}
                    associatedItemId={business.id}
                    emailLink={(task) => ({
                      from: routeApi.id,
                      to: '/app/businesses-rma/business/$businessId/dashboard/task-email/$taskId',
                      params: { taskId: task.id },
                      search: (old) => old,
                      replace: true,
                      resetScroll: false,
                    })}
                  />
                )}

                <AppViewBusinessViewDashboardViewLinksComponent />
              </div>
              <div>
                <AppViewBusinessViewDashboardViewBillingAddressComponent />
                <AppViewBusinessViewDashboardViewTransferDataButtonComponent setValue={setValue} />
                <AppViewBusinessViewDashboardViewDeliveryAddressComponent register={register} errors={errors} />
              </div>
              <div>
                <AppViewBusinessViewDashboardViewResponsibleComponent />
                {/* <BusinessDeliveryMode business={business} register={register} errors={errors} onSave={handleSubmit((data) => mutate(data))} /> */}
              </div>
              <AppViewBusinessViewDashboardViewGedComponent />
              {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && <AppViewBusinessViewDashboardViewImportOtherBusinessQuotationComponent />}
            </div>
          </div>
        </div>
      </div>
      <BusinessDashboardContext.Provider value={contextValue}>
        <Outlet />
      </BusinessDashboardContext.Provider>
    </>
  );
}
