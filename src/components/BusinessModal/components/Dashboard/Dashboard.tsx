import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBlocker } from '@tanstack/react-router';
import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiPencilAlt } from 'react-icons/hi';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateBusiness } from '../../../../utils/api/business';
import { queries } from '../../../../utils/constants/queryKeys';
import BusinessState from '../../../../utils/enums/BusinessState';
import CategoryBusiness from '../../../../utils/enums/CategoryBusiness';
import FileType from '../../../../utils/enums/FileType';
import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';
import { WorkloadAssociatedItem } from '../../../../utils/enums/WorkloadAssociatedItem';
import BusinessResponseDto from '../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../views/App/utils/functions/getAuthentifiedUser';
import BusinessRmaLinksComponent from '../../../BusinessRmaLinks/BusinessRmaLinks';
import CreateBusinessRmaLinkModalComponent from '../../../CreateBusinessRmaLinkModal/CreateBusinessRmaLinkModal';
import CreateGedDirectoryModalComponent from '../../../CreateGedDirectoryModal/CreateGedDirectoryModal';
import CreateLifesheetModalComponent from '../../../CreateLifesheetModal/CreateLifesheetModal';
import DeleteBusinessRmaLinkModalComponent from '../../../DeleteBusinessRmaLinkModal/DeleteBusinessRmaLinkModal';
import DeleteGedObjectModalComponent from '../../../DeleteGedObjectModal/DeleteGedObjectModal';
import ImportGedFilesModalComponent from '../../../ImportGedFilesModal/ImportGedFilesModal';
import LoaderModal from '../../../LoaderModal/LoaderModal';
import RenameGedObjectModalComponent from '../../../RenameGedObjectModal/RenameGedObjectModal';
import SendEmailModalComponent from '../../../SendEmailModal/SendEmailModal';
import UnlinkWorkloadModalComponent from '../../../UnlinkWorkloadModal/UnlinkWorkloadModal';
import UnsavedChangesBlockingModalComponent from '../../../UnsavedChangesBlockingModal/UnsavedChangesBlockingModal';
import WorkloadsComponent from '../../../Workloads/Workloads';
import styles from './Dashboard.module.scss';
import BusinessModalComponentDashboardComponentBillingAddressComponent from './components/BillingAddress/BillingAddress';
import BusinessModalComponentDashboardComponentDatesDataComponent from './components/DatesData/DatesData';
import AppViewBusinessViewDashboardViewDeliveryAddressComponent from './components/DeliveryAddress/DeliveryAddress';
import BusinessModalComponentDashboardComponentEmailHistoryModalComponent from './components/EmailHistoryModal/EmailHistoryModal';
import BusinessModalComponentDashboardComponentEmailModalComponent from './components/EmailModal/EmailModal';
import BusinessModalComponentDashboardComponentGedComponent from './components/Ged/Ged';
import BusinessModalComponentDashboardComponentGeneralInformationsComponent from './components/GeneralInformations/GeneralInformations';
import BusinessModalComponentDashboardComponentImportOtherBusinessQuotationComponent from './components/ImportOtherBusinessQuotation/ImportOtherBusinessQuotation';
import BusinessModalComponentDashboardComponentLifesheetComponent from './components/Lifesheet/Lifesheet';
import BusinessModalComponentDashboardComponentQuotationButtonComponent from './components/QuotationButton/QuotationButton';
import BusinessModalComponentDashboardComponentResponsibleComponent from './components/Responsible/Responsible';
import BusinessModalComponentDashboardComponentTransferDataButtonComponent from './components/TransferDataButton/TransferDataButton';
import BusinessModalComponentDashboardComponentUpdateRepresentativeModalComponent from './components/UpdateRepresentativeModal/UpdateRepresentativeModal';
import BusinessModalComponentDashboardComponentUpdateResponsibleModalComponent from './components/UpdateResponsibleModal/UpdateResponsibleModal';
import { BusinessDashboardContext } from './utils/contexts/context';
import BusinessModalComponentDashboardComponentUpdateBillingAddressModalComponent from './components/UpdateBillingAddressModal/UpdateBillingAddressModal';
import BusinessModalComponentConfirmOtherQuotationImportModalComponent from './components/ConfirmOtherQuotationImportModal/ConfirmOtherQuotationImportModal';
import { Link } from '@tanstack/react-router';
import LifeSheetResponseDto from '../../../../utils/types/LifeSheetResponseDto';
import { DeleteLifesheetModalComponent } from '../../../DeleteLifesheetModal/DeleteLifesheetModal';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/dashboard');
// const routePath = '/app/businesses-rma/business/$businessId/dashboard';

enum BusinessDashboardModal {
  CREATE_LINK,
  DELETE_LINK,
  CREATE_LIFESHEET,
  UPDATE_REPRESENTATIVE,
  RENAME_GED_OBJECT,
  CREATE_GED_DIRECTORY,
  IMPORT_GED_FILES,
  DELETE_GED_OBJECT,
  UNLINK_TASK,
  EMAIL,
  SEND_EMAIL,
  EMAIL_HISTORY,
  UPDATE_REPRESPONSIBLE,
  UPDATE_BILLING_ADDRESS,
  CONFIRM_OTHER_QUOTATION_IMPORT,
  DELETE_LIFESHEET,
}

type BusinessDashboardModalData =
  | {
      modal: BusinessDashboardModal.CREATE_LINK;
    }
  | {
      modal: BusinessDashboardModal.DELETE_LINK;
      associatedId: string;
    }
  | {
      modal: BusinessDashboardModal.CREATE_LIFESHEET;
    }
  | {
      modal: BusinessDashboardModal.UPDATE_REPRESENTATIVE;
    }
  | {
      modal: BusinessDashboardModal.RENAME_GED_OBJECT;
      objectRelativePath: string;
    }
  | {
      modal: BusinessDashboardModal.CREATE_GED_DIRECTORY;
      directoryRelativePath: string;
    }
  | {
      modal: BusinessDashboardModal.IMPORT_GED_FILES;
      directoryRelativePath: string;
    }
  | {
      modal: BusinessDashboardModal.DELETE_GED_OBJECT;
      objectRelativePath: string;
    }
  | {
      modal: BusinessDashboardModal.UNLINK_TASK;
      taskId: string;
    }
  | {
      modal: BusinessDashboardModal.EMAIL;
      emailId: string;
    }
  | {
      modal: BusinessDashboardModal.SEND_EMAIL;
    }
  | {
      modal: BusinessDashboardModal.EMAIL_HISTORY;
    }
  | {
      modal: BusinessDashboardModal.UPDATE_REPRESPONSIBLE;
    }
  | { modal: BusinessDashboardModal.UPDATE_BILLING_ADDRESS }
  | { modal: BusinessDashboardModal.CONFIRM_OTHER_QUOTATION_IMPORT; otherBusiness: BusinessResponseDto }
  | {
      modal: BusinessDashboardModal.DELETE_LIFESHEET;
      lifesheet: LifeSheetResponseDto;
    };

const yupSchema = yup.object({
  businessName: yup.string().required('Champs requis.'),
  businessInstaller: yup.string().nullable(),
  businessExport: yup.boolean().required('Champs requis.'),
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

type BusinessModalComponentDashboardComponentProps = Readonly<{
  business: BusinessResponseDto;
  goToNextStep: () => void;
}>;
export default function BusinessModalComponentDashboardComponent({ business, goToNextStep }: BusinessModalComponentDashboardComponentProps) {
  const queryClient = useQueryClient();

  // const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const [modalData, setModalData] = useState<BusinessDashboardModalData>();

  const formDefaultValues = useMemo(
    () => ({
      businessName: business.title ?? '',
      businessInstaller: business.installerProfileName ?? '',
      businessExport: !business.exportTva,
      businessDeliveryMode: business.deliveryMode ?? null,
      receiverCompanyName: business.deliverAddressCompany ?? '',
      receiverName: business.deliverAddressName ?? '',
      receiverAddressOne: business.deliverAddressOne ?? '',
      receiverAddressTwo: business.deliverAddressTwo ?? '',
      receiverZipCode: business.deliverAddressZipCode ?? '',
      receiverCity: business.deliverAddressCity ?? '',
      receiverPhoneNumber: business.deliverPhoneNumber ?? '',
      receiverEmail: business.deliverEmail ?? '',
    }),
    [
      business.title,
      business.installerProfileName,
      business.exportTva,
      business.deliveryMode,
      business.deliverAddressName,
      business.deliverAddressOne,
      business.deliverAddressTwo,
      business.deliverAddressZipCode,
      business.deliverAddressCity,
      business.deliverPhoneNumber,
      business.deliverEmail,
    ],
  );

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case BusinessDashboardModal.CREATE_LINK:
        return (
          <CreateBusinessRmaLinkModalComponent category={CategoryBusiness.AFFAIRE} number={business.numBusiness} onClose={() => setModalData(undefined)} />
        );
      case BusinessDashboardModal.DELETE_LINK:
        return (
          <DeleteBusinessRmaLinkModalComponent
            category={CategoryBusiness.AFFAIRE}
            number={business.numBusiness}
            associatedId={modalData.associatedId}
            onClose={() => setModalData(undefined)}
          />
        );
      case BusinessDashboardModal.CREATE_LIFESHEET:
        return (
          <CreateLifesheetModalComponent
            associatedItemType={LifesheetAssociatedItem.BUSINESS}
            associatedItemId={business.id}
            onClose={() => setModalData(undefined)}
          />
        );
      case BusinessDashboardModal.UPDATE_REPRESENTATIVE:
        return <BusinessModalComponentDashboardComponentUpdateRepresentativeModalComponent business={business} onClose={() => setModalData(undefined)} />;
      case BusinessDashboardModal.RENAME_GED_OBJECT:
        return (
          <RenameGedObjectModalComponent
            type={FileType.AFFAIRE}
            id={business.id}
            objectRelativePath={modalData.objectRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case BusinessDashboardModal.CREATE_GED_DIRECTORY:
        return (
          <CreateGedDirectoryModalComponent
            type={FileType.AFFAIRE}
            id={business.id}
            directoryRelativePath={modalData.directoryRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case BusinessDashboardModal.IMPORT_GED_FILES:
        return (
          <ImportGedFilesModalComponent
            type={FileType.AFFAIRE}
            id={business.id}
            directoryRelativePath={modalData.directoryRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case BusinessDashboardModal.DELETE_GED_OBJECT:
        return (
          <DeleteGedObjectModalComponent
            type={FileType.AFFAIRE}
            id={business.id}
            objectRelativePath={modalData.objectRelativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case BusinessDashboardModal.UNLINK_TASK:
        return <UnlinkWorkloadModalComponent taskId={modalData.taskId} onClose={() => setModalData(undefined)} />;
      case BusinessDashboardModal.EMAIL:
        return <BusinessModalComponentDashboardComponentEmailModalComponent emailId={modalData.emailId} onClose={() => setModalData(undefined)} />;
      case BusinessDashboardModal.SEND_EMAIL:
        return (
          <SendEmailModalComponent
            isOpen={true}
            onClose={() => setModalData(undefined)}
            defaultSubject={`${business.numBusiness} - ${business.title}`}
            defaultRecipient={business.profileEmail ? [business.profileEmail] : undefined}
            lifeSheetInfoDto={{
              businessNumber: business.numBusiness,
              businessName: business.title ?? undefined,
              businessId: business.id,
            }}
            storageKey={`business-modal-${business.id}`}
          />
        );
      case BusinessDashboardModal.EMAIL_HISTORY:
        return <BusinessModalComponentDashboardComponentEmailHistoryModalComponent business={business} onClose={() => setModalData(undefined)} />;
      case BusinessDashboardModal.UPDATE_REPRESPONSIBLE:
        return <BusinessModalComponentDashboardComponentUpdateResponsibleModalComponent business={business} onClose={() => setModalData(undefined)} />;
      case BusinessDashboardModal.UPDATE_BILLING_ADDRESS:
        return <BusinessModalComponentDashboardComponentUpdateBillingAddressModalComponent business={business} onClose={() => setModalData(undefined)} />;
      case BusinessDashboardModal.CONFIRM_OTHER_QUOTATION_IMPORT:
        return (
          <BusinessModalComponentConfirmOtherQuotationImportModalComponent
            business={business}
            otherBusiness={modalData.otherBusiness}
            onClose={() => setModalData(undefined)}
          />
        );
      case BusinessDashboardModal.DELETE_LIFESHEET:
        return <DeleteLifesheetModalComponent lifesheet={modalData.lifesheet} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData, business]);

  const {
    register,
    formState: { errors, isDirty },
    setValue,
    handleSubmit,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: formDefaultValues,
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

  const { proceed, reset, status } = useBlocker({
    condition: isDirty,
  });

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
        exportTva: !data.businessExport,
        billAndLock: false,
        deliveryMode: data.businessDeliveryMode,
        installerProfileId: business.installerProfileId,
        installerProfileName: data.businessInstaller,
        installerProfileEmail: business.installerProfileEmail,
        type: business.type!,
      });
    },
    onSuccess: (business) => {
      queryClient.setQueryData<BusinessResponseDto>(queries.businesses.detail._ctx.byId(business.id).queryKey, business);
      // queryClient.invalidateQueries({ queryKey: queries.businesses._def });
      toast.success('Les modifications ont été enregistrées');
      if (status === 'blocked') proceed();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'enregistrement des modifications");
    },
  });

  const onSave = handleSubmit((data) => save(data));

  useEffect(() => {
    resetForm(formDefaultValues, { keepDirtyValues: true });
  }, [formDefaultValues]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headers_buttons}>
          {/* {(business.state === BusinessState.DEVIS || business.state === BusinessState.CREATED) && !business.archived && (
            <Link from={routePath} to="delete" search replace resetScroll={false} ignoreBlocker className="btn btn-secondary">
              <FaTrash color="#FFF" width={14} height={14} />
              Supprimer cette affaire
            </Link>
          )} */}
          <button className={styles.business_number} onClick={copyBusinessNumber}>
            {business.numBusiness}
          </button>

          {!business.archived && (
            <div className={styles.right_buttons}>
              {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                <>
                  <Link
                    to="/app/businesses-rma/business/$businessId/dashboard"
                    params={{ businessId: business.id }}
                    replace
                    resetScroll={false}
                    ignoreBlocker
                    preload="intent"
                    className="btn btn-secondary"
                  >
                    Ouvrir l&apos;affaire
                  </Link>
                  <button className="btn btn-primary" onClick={() => setModalData({ modal: BusinessDashboardModal.SEND_EMAIL })}>
                    Envoyer un mail
                  </button>
                  <button className="btn btn-primary" onClick={() => setModalData({ modal: BusinessDashboardModal.EMAIL_HISTORY })}>
                    Historique des mails
                  </button>
                  {/* <Link from={routePath} to="send-email" search replace resetScroll={false} ignoreBlocker preload="intent" className="btn btn-primary">
                    Envoyer un mail
                  </Link>
                  <Link from={routePath} to="email-history" search replace resetScroll={false} ignoreBlocker preload="intent" className="btn btn-primary">
                    Historique des mails
                  </Link> */}
                </>
              )}
              {(business.state === null ||
                ![BusinessState.FACTURE, BusinessState.ARC, BusinessState.BP, BusinessState.BL].includes(business.state) ||
                user.userInfo.roles.find((role) => ['ROLE_VIZEO', 'ROLE_DIRECTION_VIZEO', 'ROLE_STAGIAIRE_VIZEO'].includes(role))) && (
                <button className="btn btn-secondary" disabled={isSavePending} onClick={onSave}>
                  {isSavePending ? 'Sauvegarde en cours...' : 'Sauvegarder'}
                </button>
              )}
              {/* <Link from={routePath} to="../study" className="btn btn-secondary">
                {"Accès à l'étude"}
              </Link> */}
              <BusinessModalComponentDashboardComponentQuotationButtonComponent business={business} goToNextStep={goToNextStep} />
            </div>
          )}
        </div>
        <BusinessModalComponentDashboardComponentDatesDataComponent business={business} />

        <div className={classNames(styles.content_grid, styles.two_grid)}>
          <div className="gap-y flex flex-col gap-y-2">
            <BusinessRmaLinksComponent
              category={CategoryBusiness.AFFAIRE}
              number={business.numBusiness}
              onItemClick={() => {}} // TODO: add onItemClick
              canCreate={user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')}
              onCreateClick={() => setModalData({ modal: BusinessDashboardModal.CREATE_LINK })}
              onDeleteClick={(data) => setModalData({ modal: BusinessDashboardModal.DELETE_LINK, associatedId: data.id })}
              className="flex-1"
            />
            {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <BusinessModalComponentDashboardComponentLifesheetComponent
                onCreateButtonClick={() => setModalData({ modal: BusinessDashboardModal.CREATE_LIFESHEET })}
                onDeleteButtonClick={(lifesheet) => setModalData({ modal: BusinessDashboardModal.DELETE_LIFESHEET, lifesheet })}
                business={business}
              />
            )}
          </div>
          <div className={styles.second_grid}>
            <BusinessModalComponentDashboardComponentGeneralInformationsComponent
              business={business}
              register={register}
              errors={errors}
              onSave={onSave}
              isSavePending={isSavePending}
            />
            <div className={styles.address_sections}>
              <div>
                <div className={styles.enterprise_category}>
                  <p>
                    Catégorie : <span>{business.enterpriseCategory}</span>
                  </p>
                </div>
                <div className="flex gap-x-3">
                  {user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && (
                    <div className="flex gap-x-1">
                      <span className="m-auto font-[DIN2014] text-sm">
                        Représentant : <span className="font-bold text-(--primary-color)">{business.representativeName || 'Aucun'}</span>
                      </span>
                      <button className="m-auto flex" onClick={() => setModalData({ modal: BusinessDashboardModal.UPDATE_REPRESENTATIVE })}>
                        <HiPencilAlt className="text-(--primary-color)" />
                      </button>
                      {/* <Link
                        from={routePath}
                        to="update-representative"
                        search
                        replace
                        resetScroll={false}
                        preload="intent"
                        ignoreBlocker
                        className="m-auto flex"
                      >
                        <HiPencilAlt className="text-(--primary-color)" />
                      </Link> */}
                    </div>
                  )}
                  {/* <Link from={routePath} to="address-book" search replace resetScroll={false} preload="intent" ignoreBlocker className="btn btn-primary">
                    Carnet d&apos;adresse
                  </Link> */}
                </div>
              </div>
              <div>
                {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                  <WorkloadsComponent
                    associatedItemType={WorkloadAssociatedItem.BUSINESS}
                    associatedItemId={business.id}
                    onEmailClick={(data) => setModalData({ modal: BusinessDashboardModal.EMAIL, emailId: data.mailId! })}
                    onUnlinkClick={(data) => setModalData({ modal: BusinessDashboardModal.UNLINK_TASK, taskId: data.id })}
                    // emailLink={(task) => ({
                    //   from: routePath,
                    //   to: '/app/businesses-rma/business/$businessId/dashboard/task-email/$taskId',
                    //   params: { taskId: task.id },
                    //   search: true,
                    //   replace: true,
                    //   resetScroll: false,
                    //   ignoreBlocker: true,
                    // })}
                    // unlinkLink={(task) => ({
                    //   from: routePath,
                    //   to: '/app/businesses-rma/business/$businessId/dashboard/unlink-task/$taskId',
                    //   params: { taskId: task.id },
                    //   search: true,
                    //   replace: true,
                    //   resetScroll: false,
                    //   ignoreBlocker: true,
                    // })}
                  />
                )}
              </div>
              <div className="h-fit">
                <BusinessModalComponentDashboardComponentBillingAddressComponent
                  business={business}
                  onEditClick={() => setModalData({ modal: BusinessDashboardModal.UPDATE_BILLING_ADDRESS })}
                />
                <BusinessModalComponentDashboardComponentTransferDataButtonComponent business={business} setValue={setValue} saveBusiness={onSave} />
                <AppViewBusinessViewDashboardViewDeliveryAddressComponent register={register} errors={errors} />
              </div>
              <div>
                <BusinessModalComponentDashboardComponentResponsibleComponent
                  business={business}
                  onEdit={() => setModalData({ modal: BusinessDashboardModal.UPDATE_REPRESPONSIBLE })}
                />
                {/* <BusinessDeliveryMode business={business} register={register} errors={errors} onSave={handleSubmit((data) => mutate(data))} /> */}
              </div>
              <BusinessModalComponentDashboardComponentGedComponent
                business={business}
                onCreateDirectoryClick={(data) =>
                  setModalData({ modal: BusinessDashboardModal.CREATE_GED_DIRECTORY, directoryRelativePath: data?.relativePath ?? '' })
                }
                onImportFilesClick={(data) => setModalData({ modal: BusinessDashboardModal.IMPORT_GED_FILES, directoryRelativePath: data?.relativePath ?? '' })}
                onRenameClick={(data) => setModalData({ modal: BusinessDashboardModal.RENAME_GED_OBJECT, objectRelativePath: data.relativePath })}
                onDeleteClick={(data) => setModalData({ modal: BusinessDashboardModal.DELETE_GED_OBJECT, objectRelativePath: data.relativePath })}
              />
              {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                <BusinessModalComponentDashboardComponentImportOtherBusinessQuotationComponent
                  business={business}
                  onConfirm={(otherBusiness) => setModalData({ modal: BusinessDashboardModal.CONFIRM_OTHER_QUOTATION_IMPORT, otherBusiness })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <BusinessDashboardContext.Provider value={contextValue}>{/* <Outlet /> */}</BusinessDashboardContext.Provider>
      {status === 'blocked' && <UnsavedChangesBlockingModalComponent proceed={proceed} reset={reset} save={onSave} isSaving={isSavePending} />}
      <React.Suspense fallback={<LoaderModal />}>{modal}</React.Suspense>
    </>
  );
}
