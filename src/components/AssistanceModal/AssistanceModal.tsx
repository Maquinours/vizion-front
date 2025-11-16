import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateTechnicalSupport } from '../../utils/api/technicalSupports';
import { queries } from '../../utils/constants/queryKeys';
import CategoryBusiness from '../../utils/enums/CategoryBusiness';
import FileType from '../../utils/enums/FileType';
import { LifesheetAssociatedItem } from '../../utils/enums/LifesheetAssociatedItem';
import AllBusinessResponseDto from '../../utils/types/AllBusinessResponseDto';
import BusinessResponseDto from '../../utils/types/BusinessResponseDto';
import FileDataTreeResponseDto from '../../utils/types/FileDataTreeResponseDto';
import CreateBusinessRmaLinkModalComponent from '../CreateBusinessRmaLinkModal/CreateBusinessRmaLinkModal';
import CreateGedDirectoryModalComponent from '../CreateGedDirectoryModal/CreateGedDirectoryModal';
import CreateLifesheetModalComponent from '../CreateLifesheetModal/CreateLifesheetModal';
import DeleteBusinessRmaLinkModalComponent from '../DeleteBusinessRmaLinkModal/DeleteBusinessRmaLinkModal';
import DeleteGedObjectModalComponent from '../DeleteGedObjectModal/DeleteGedObjectModal';
import ImportGedFilesModalComponent from '../ImportGedFilesModal/ImportGedFilesModal';
import RenameGedObjectModalComponent from '../RenameGedObjectModal/RenameGedObjectModal';
import styles from './AssistanceModal.module.scss';
import AppViewAssistanceViewButtonsSectionComponent from './components/ButtonsSection/ButtonsSection';
import AssistanceModalComponentCreateFaqModalComponent from './components/CreateFaqModal/CreateFaqModal';
import AppViewAssistanceViewCumulatedTimeCardComponent from './components/CumulatedTimeCard/CumulatedTimeCard';
import AssistanceModalComponentEditCumulatedTimeModalComponent from './components/EditCumulatedTimeModal/EditCumulatedTimeModal';
import AssistanceModalComponentEditNoBilledTimeModalComponent from './components/EditNoBilledTimeModal/EditNoBilledTimeModal';
import AssistanceModalComponentEditSubtitleModalComponent from './components/EditSubtitlteModal/EditSubtitleModal';
import AppViewAssistanceViewExpectedTimeCardComponent from './components/ExpectedTimeCard/ExpectedTimeCard';
import AppViewAssistanceViewGedComponent from './components/Ged/Ged';
import AppViewAssistanceViewLifesheetComponent from './components/Lifesheet/Lifesheet';
import AppViewAssistanceViewLinksComponent from './components/Links/Links';
import AppViewAssistanceViewNoBilledTimeCardComponent from './components/NoBilledTimeCard/NoBilledTimeCard';
import AssistanceModalComponentPdfModalComponent from './components/PdfModal/PdfModal';
import AppViewAssistanceViewSubTitleCard from './components/SubtitleCard/SubtitleCard';
import AppViewAssistanceViewSummaryCardComponent from './components/SummaryCard/SummaryCard';
import AppViewAssistanceViewTitleCardComponent from './components/TitleCard/TitleCard';
import { AssistanceContext } from './utils/contexts/context';
import ReactModal from 'react-modal';
import LifeSheetResponseDto from '../../utils/types/LifeSheetResponseDto';
import { DeleteLifesheetModalComponent } from '../DeleteLifesheetModal/DeleteLifesheetModal';

enum ModalType {
  EDIT_SUBTITLE,
  EDIT_CUMULATED_TIME,
  CREATE_LIFESHEET,
  EDIT_NO_BILLED_TIME,
  CREATE_LINK,
  DELETE_LINK,
  CREATE_GED_DIRECTORY,
  IMPORT_GED_FILES,
  RENAME_GED_OBJECT,
  DELETE_GED_OBJECT,
  CREATE_FAQ,
  PDF,
  DELETE_LIFESHEET,
}

type ModalData =
  | { modal: ModalType.EDIT_SUBTITLE }
  | { modal: ModalType.EDIT_CUMULATED_TIME }
  | { modal: ModalType.CREATE_LIFESHEET }
  | { modal: ModalType.EDIT_NO_BILLED_TIME }
  | { modal: ModalType.CREATE_LINK }
  | {
      modal: ModalType.DELETE_LINK;
      associated: AllBusinessResponseDto;
    }
  | {
      modal: ModalType.CREATE_GED_DIRECTORY;
      parent: FileDataTreeResponseDto | undefined;
    }
  | {
      modal: ModalType.IMPORT_GED_FILES;
      parent: FileDataTreeResponseDto | undefined;
    }
  | {
      modal: ModalType.RENAME_GED_OBJECT;
      object: FileDataTreeResponseDto;
    }
  | {
      modal: ModalType.DELETE_GED_OBJECT;
      object: FileDataTreeResponseDto;
    }
  | {
      modal: ModalType.CREATE_FAQ;
    }
  | {
      modal: ModalType.PDF;
    }
  | {
      modal: ModalType.DELETE_LIFESHEET;
      lifesheet: LifeSheetResponseDto;
    };

const amountFormatter = (value: number) => {
  return value.toLocaleString('fr-FR', {
    minimumIntegerDigits: 2,
  });
};

const yupSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  predefinedTime: yup.number().required('Le temps prévu est requis'), // number of hours
  cumulatedTime: yup.number().required('Le temps cumulé est requis'), // number of seconds
  noBilledTime: yup.number().required('Le temps non facturé est requis'),
});

export type AssistanceFormType = yup.InferType<typeof yupSchema>;

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId_/assistance/$assistanceId');
// const routePath = '/app/businesses-rma/business/$businessId/assistance/$assistanceId';

type AssistanceModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  assistanceId: string;
  onClose: () => void;
}>;
export default function AssistanceModalComponent({ business, assistanceId, onClose }: AssistanceModalComponentProps) {
  const queryClient = useQueryClient();

  // const { businessId, assistanceId } = routeApi.useParams();
  // const { assistanceModal } = routeApi.useSearch();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  const { data: assistance } = useSuspenseQuery(queries['technical-supports'].detail._ctx.byId(assistanceId));

  const [modalData, setModalData] = useState<ModalData | undefined>(undefined);

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.EDIT_SUBTITLE:
        return <AssistanceModalComponentEditSubtitleModalComponent onClose={() => setModalData(undefined)} />;
      case ModalType.EDIT_CUMULATED_TIME:
        return <AssistanceModalComponentEditCumulatedTimeModalComponent onClose={() => setModalData(undefined)} />;
      case ModalType.CREATE_LIFESHEET:
        return (
          <CreateLifesheetModalComponent
            associatedItemType={LifesheetAssociatedItem.ASSISTANCE}
            associatedItemId={assistance.id}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.EDIT_NO_BILLED_TIME:
        return <AssistanceModalComponentEditNoBilledTimeModalComponent onClose={() => setModalData(undefined)} />;
      case ModalType.CREATE_LINK:
        return (
          <CreateBusinessRmaLinkModalComponent category={CategoryBusiness.AFFAIRE} number={business.numBusiness} onClose={() => setModalData(undefined)} />
        );
      case ModalType.DELETE_LINK:
        return (
          <DeleteBusinessRmaLinkModalComponent
            category={CategoryBusiness.AFFAIRE}
            number={business.numBusiness}
            associatedId={modalData.associated.id}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.CREATE_GED_DIRECTORY:
        return (
          <CreateGedDirectoryModalComponent
            type={FileType.ASSISTANCE}
            id={assistance.id}
            directoryRelativePath={modalData.parent?.relativePath ?? ''}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.IMPORT_GED_FILES:
        return (
          <ImportGedFilesModalComponent
            type={FileType.ASSISTANCE}
            id={assistance.id}
            directoryRelativePath={modalData.parent?.relativePath ?? ''}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.RENAME_GED_OBJECT:
        return (
          <RenameGedObjectModalComponent
            type={FileType.ASSISTANCE}
            id={assistance.id}
            objectRelativePath={modalData.object.relativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.DELETE_GED_OBJECT:
        return (
          <DeleteGedObjectModalComponent
            type={FileType.ASSISTANCE}
            id={assistance.id}
            objectRelativePath={modalData.object.relativePath}
            onClose={() => setModalData(undefined)}
          />
        );
      case ModalType.CREATE_FAQ:
        return <AssistanceModalComponentCreateFaqModalComponent business={business} assistance={assistance} onClose={() => setModalData(undefined)} />;
      case ModalType.PDF:
        return <AssistanceModalComponentPdfModalComponent assistance={assistance} onClose={() => setModalData(undefined)} />;
      case ModalType.DELETE_LIFESHEET:
        return <DeleteLifesheetModalComponent lifesheet={modalData.lifesheet} onClose={() => setModalData(undefined)} />;
    }
  }, [modalData, assistance]);

  // const modal = useMemo(() => {
  //   if (assistanceModal === 'before-close') return <AppViewAssistanceViewBeforeCloseModalView />;
  //   return null;
  // }, [assistanceModal]);

  const { register, control, getValues, setValue, resetField } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      cumulatedTime: 0,
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: () =>
      updateTechnicalSupport(assistance.id, {
        name: getValues('name'),
        businessNum: assistance.businessNumber,
        predefinedTime: `${getValues('predefinedTime')}:00:00`,
        cumulatedTime: (() => {
          const duration = moment.duration(getValues('cumulatedTime'), 'seconds');
          return `${amountFormatter(Math.floor(duration.asHours()))}:${amountFormatter(duration.minutes())}:${amountFormatter(duration.seconds())}`;
        })(),
        noBilledTime: (() => {
          const duration = moment.duration(getValues('noBilledTime'), 'seconds');
          return `${amountFormatter(Math.floor(duration.asHours()))}:${amountFormatter(duration.minutes())}:${amountFormatter(duration.seconds())}`;
        })(),
      }),
    onSuccess: (technicalSupport) => {
      queryClient.setQueryData(queries['technical-supports'].detail._ctx.byId(technicalSupport.id).queryKey, technicalSupport);
      toast.success("L'assistance a bien été mise à jour.");
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la mise à jour de l'assistance");
    },
  });

  const contextValue = useMemo(() => ({ register, control, getValues, setValue, update }), [register, control, getValues, setValue, update]);

  useEffect(() => {
    setValue('name', assistance.name);
    if (assistance.predefinedTime) setValue('predefinedTime', parseInt(assistance.predefinedTime.split(':')[0]));
    else resetField('predefinedTime');
  }, [assistance.id]);

  return (
    <ReactModal isOpen onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <AssistanceContext.Provider value={contextValue}>
        <div className="flex flex-row gap-x-3 py-2">
          {/* <Link from={routePath} to="/app/businesses-rma/business/$businessId" title="Retourner dans l'affaire" className="btn btn-primary flex w-fit">
          <TiArrowBack size={16} />
        </Link> */}
          <span className="content-center font-bold text-(--primary-color)">
            {business.numBusiness} - {business.title ?? ''}
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.content_grid}>
            <div className={styles.first_grid}>
              <AppViewAssistanceViewTitleCardComponent assistance={assistance} />
              <AppViewAssistanceViewSubTitleCard assistance={assistance} onEditButtonClick={() => setModalData({ modal: ModalType.EDIT_SUBTITLE })} />
              <AppViewAssistanceViewExpectedTimeCardComponent assistance={assistance} />
              <AppViewAssistanceViewCumulatedTimeCardComponent
                assistance={assistance}
                onEditButtonClick={() => setModalData({ modal: ModalType.EDIT_CUMULATED_TIME })}
              />
              <AppViewAssistanceViewLifesheetComponent
                assistance={assistance}
                onCreateButtonClick={() => setModalData({ modal: ModalType.CREATE_LIFESHEET })}
                onDeleteButtonClick={(lifesheet) => setModalData({ modal: ModalType.DELETE_LIFESHEET, lifesheet })}
              />
              <AppViewAssistanceViewGedComponent
                assistance={assistance}
                onCreateDirectoryClick={(data) => setModalData({ modal: ModalType.CREATE_GED_DIRECTORY, parent: data })}
                onImportFilesClick={(data) => setModalData({ modal: ModalType.IMPORT_GED_FILES, parent: data })}
                onRenameClick={(data) => setModalData({ modal: ModalType.RENAME_GED_OBJECT, object: data })}
                onDeleteClick={(data) => setModalData({ modal: ModalType.DELETE_GED_OBJECT, object: data })}
              />
            </div>
            <div className={styles.second_grid}>
              <AppViewAssistanceViewNoBilledTimeCardComponent
                assistance={assistance}
                onEditButtonClick={() => setModalData({ modal: ModalType.EDIT_NO_BILLED_TIME })}
              />
              <AppViewAssistanceViewSummaryCardComponent assistance={assistance} />
              <AppViewAssistanceViewButtonsSectionComponent
                onCreateFaqButtonClick={() => setModalData({ modal: ModalType.CREATE_FAQ })}
                onEditButtonClick={() => setModalData({ modal: ModalType.PDF })}
              />
              <AppViewAssistanceViewLinksComponent
                business={business}
                onCreateClick={() => setModalData({ modal: ModalType.CREATE_LINK })}
                onDeleteClick={(data) => setModalData({ modal: ModalType.DELETE_LINK, associated: data })}
              />
            </div>
          </div>
        </div>
        {modal}
        {/* <Outlet /> */}
        {/* {modal} */}
      </AssistanceContext.Provider>
    </ReactModal>
  );
}
