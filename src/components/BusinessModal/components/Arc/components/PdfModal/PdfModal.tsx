import { pdf, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { formatFileName } from '../../../../../../utils/functions/files';
import BusinessArcResponseDto from '../../../../../../utils/types/BusinessArcResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import ProfileResponseDto from '../../../../../../utils/types/ProfileResponseDto';
import AppViewBusinessViewArcViewPdfModalViewPdfComponent from '../../../../../../views/App/views/Business/views/Arc/views/PdfModal/components/Pdf/Pdf';
import LoaderModal from '../../../../../LoaderModal/LoaderModal';
import SendEmailModalComponent from '../../../../../SendEmailModal/SendEmailModal';
import styles from './PdfModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc/pdf');
// const routePath = '/app/businesses-rma/business/$businessId/arc/pdf';

enum ModalType {
  LOADING,
  SEND_BY_EMAIL,
}

type ModalData = { modal: ModalType.LOADING } | { modal: ModalType.SEND_BY_EMAIL; representative: EnterpriseResponseDto | undefined; file: File };

type BusinessModalComponentArcComponentPdfModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  arc: BusinessArcResponseDto;
  hideReferencesPrices: boolean;
  onClose: () => void;
}>;
export default function BusinessModalComponentArcComponentPdfModalComponent({
  business,
  arc,
  hideReferencesPrices,
  onClose,
}: BusinessModalComponentArcComponentPdfModalComponentProps) {
  //   const navigate = routeApi.useNavigate();

  //   const { businessId } = routeApi.useParams();
  //   const { hideReferencesPrices } = routeApi.useSearch();

  //   const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  //   const { data: arc } = useSuspenseQuery(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));

  //   const onClose = () => {
  //     navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  //   };

  const queryClient = useQueryClient();

  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.LOADING:
        return <LoaderModal />;
      case ModalType.SEND_BY_EMAIL: {
        const recipient = business.profileEmail ?? business.deliverEmail ?? undefined;
        return (
          <SendEmailModalComponent
            isOpen
            onClose={() => setModalData(undefined)}
            defaultRecipient={recipient ? [recipient] : undefined}
            defaultCc={modalData.representative?.profiles
              .filter(
                (profile): profile is ProfileResponseDto & { email: NonNullable<ProfileResponseDto['email']> } =>
                  profile.civility === 'Service' && !!profile.email,
              )
              .map((service) => service.email)}
            defaultSubject={`Arc ${arc.number}`}
            defaultAttachments={[modalData.file]}
            lifeSheetInfoDto={{
              businessNumber: business.numBusiness,
              businessName: business.title ?? '',
              businessId: business.id,
            }}
          />
        );
      }
    }
  }, [modalData]);

  const onSendByEmailClick = async () => {
    setModalData({ modal: ModalType.LOADING });
    const department = await (business.deliveryDepartmentCode
      ? queryClient.ensureQueryData(queries.departments.detail._ctx.byCode(business.deliveryDepartmentCode))
      : Promise.resolve(undefined));
    const representative = await (department?.repEnterprise
      ? queryClient.ensureQueryData(queries.enterprise.detail(department.repEnterprise!.id))
      : Promise.resolve(undefined));
    const blob = await pdf(
      <AppViewBusinessViewArcViewPdfModalViewPdfComponent business={business} arc={arc} hideReferencesPrices={hideReferencesPrices} />,
    ).toBlob();
    const file = new File([blob], formatFileName(`ARC-${arc.number}.pdf`), {
      type: blob.type,
    });
    setModalData({ modal: ModalType.SEND_BY_EMAIL, representative, file });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Votre ARC :</h6>
          </div>
          <div className={styles.modal_pdfviewer}>
            <PDFViewer>
              <AppViewBusinessViewArcViewPdfModalViewPdfComponent business={business} arc={arc} hideReferencesPrices={hideReferencesPrices} />
            </PDFViewer>
          </div>
          <div className={styles.modal_footer}>
            <button className="btn btn-primary" onClick={onClose}>
              Modifier
            </button>
            <PDFDownloadLink
              document={<AppViewBusinessViewArcViewPdfModalViewPdfComponent business={business} arc={arc} hideReferencesPrices={hideReferencesPrices} />}
              fileName={`ARC-` + arc.number + '.pdf'}
            >
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
            <button className="btn btn-secondary" onClick={onSendByEmailClick}>
              Envoyer par mail
            </button>
            {/* <Link from={routePath} to="send-by-email" search replace resetScroll={false} preload="intent" ignoreBlocker className="btn btn-secondary">
              Envoyer par mail
            </Link> */}
          </div>
        </div>
      </ReactModal>
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
