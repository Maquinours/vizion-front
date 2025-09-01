import { pdf, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { formatFileName } from '../../../../../../../../utils/functions/files';
import BusinessQuotationResponseDto from '../../../../../../../../utils/types/BusinessQuotationResponseDto';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../../../views/App/utils/functions/getAuthentifiedUser';
import AppViewBusinessViewQuotationViewPdfModalViewPdfComponent from '../../../../../../../../views/App/views/Business/views/Quotation/views/PdfModal/components/Pdf/Pdf';
import LoaderModal from '../../../../../../../LoaderModal/LoaderModal';
import SendEmailModalComponent from '../../../../../../../SendEmailModal/SendEmailModal';
import styles from './PdfModal.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation/pdf');
// const routePath = '/app/businesses-rma/business/$businessId/quotation/pdf';

enum ModalType {
  LOADING,
  SEND_BY_EMAIL,
}

type ModalData =
  | { modal: ModalType.LOADING }
  | { modal: ModalType.SEND_BY_EMAIL; representative: EnterpriseResponseDto | undefined; commercialNoticeFile: File; quotationPdfFile: File };

type BusinessModalComponentQuotationComponentPdfModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  quotation: BusinessQuotationResponseDto;
  hideAddresses: boolean;
  hideReferences: boolean;
  hidePrices: boolean;
  hideTotal: boolean;
  onClose: () => void;
}>;
export default function BusinessModalComponentQuotationComponentPdfModalComponent({
  business,
  quotation,
  hideAddresses,
  hideReferences,
  hidePrices,
  hideTotal,
  onClose,
}: BusinessModalComponentQuotationComponentPdfModalComponentProps) {
  const queryClient = useQueryClient();
  //   const navigate = routeApi.useNavigate();

  //   const { businessId } = routeApi.useParams();
  //   const { hideAddresses, hideReferences, hidePrices, hideTotal } = routeApi.useSearch();

  const [modalData, setModalData] = useState<ModalData>();

  const { data: user } = useAuthentifiedUserQuery();

  //   const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  //   const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  //   const onClose = () => {
  //     navigate({ to: '..', search: true, replace: true, resetScroll: false, ignoreBlocker: true });
  //   };

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.LOADING:
        return <LoaderModal />;
      case ModalType.SEND_BY_EMAIL:
        const defaultRecipient = (() => {
          if (business.enterpriseName === 'DIVERS CLIENTS') {
            if (business.billingEmail) return [business.billingEmail];
          } else if (business.profileEmail) return [business.profileEmail];
        })();

        return (
          <SendEmailModalComponent
            isOpen={true}
            onClose={onClose}
            defaultAttachments={[modalData.quotationPdfFile, modalData.commercialNoticeFile]}
            defaultRecipient={defaultRecipient}
            defaultCc={modalData.representative?.profiles
              .filter((profile) => profile.civility === 'Service')
              .map((service) => service.email!)
              .filter((email) => !!email)}
            defaultSubject={`Devis ${quotation.number} ${business.title ?? ''}`}
            defaultContent={`Bonjour <br /><br /><p>Suite à la demande, ci-joint le devis, accompagné des documents suivants :</p> <br /><ul><li>L'offre de prix HT</li><li>Le dossier technique pour le client</li><li>Les notices commerciales pour le client</li></ul>`}
            lifeSheetInfoDto={{
              businessNumber: business.numBusiness,
              businessName: business.title ?? '',
              businessId: business.id,
            }}
            storageKey={`business-modal-quotation-pdf-${business.id}`}
          />
        );
    }
  }, [modalData, business, quotation]);

  const onSendByEmailClick = async () => {
    setModalData({ modal: ModalType.LOADING });

    const commercialNoticeData = await queryClient.ensureQueryData(
      queries['commercial-notices'].data._ctx.byProductReferences(
        (quotation.subQuotationList
          ?.flatMap((subQuotation) => subQuotation.quotationDetails?.map((detail) => detail.productReference))
          ?.filter((reference) => reference !== null) ?? []) as string[],
      ),
    );
    const commercialNoticeBlob = await (await fetch(`data:application/pdf;base64,${commercialNoticeData}`)).blob();
    const commercialNoticeFile = new File([commercialNoticeBlob], 'DOC_COMMERCIAL_VIZEO.pdf', { type: commercialNoticeBlob.type });

    const department = await (business.deliveryDepartmentCode
      ? queryClient.ensureQueryData(queries.departments.detail._ctx.byCode(business.deliveryDepartmentCode))
      : Promise.resolve(undefined));
    const representative = await (department?.repEnterprise
      ? queryClient.ensureQueryData(queries.enterprise.detail(department.repEnterprise.id))
      : Promise.resolve(undefined));
    const quotationPdfBlob = await pdf(
      <AppViewBusinessViewQuotationViewPdfModalViewPdfComponent
        business={business}
        quotation={quotation}
        hideAddresses={hideAddresses}
        hideReferences={hideReferences}
        hidePrices={hidePrices}
        hideTotal={hideTotal}
      />,
    ).toBlob();
    const quotationPdfFile = new File([quotationPdfBlob], formatFileName(`Devis-${quotation.number}.pdf`), {
      type: quotationPdfBlob.type,
    });

    setModalData({
      modal: ModalType.SEND_BY_EMAIL,
      representative: representative,
      commercialNoticeFile: commercialNoticeFile,
      quotationPdfFile: quotationPdfFile,
    });
  };

  return (
    <>
      <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
        <div className={styles.modal_container}>
          <div className={styles.modal_title}>
            <h6>Votre devis :</h6>
          </div>
          <div className={styles.modal_pdfviewer}>
            <PDFViewer>
              <AppViewBusinessViewQuotationViewPdfModalViewPdfComponent
                business={business}
                quotation={quotation}
                hideAddresses={hideAddresses}
                hideReferences={hideReferences}
                hidePrices={hidePrices}
                hideTotal={hideTotal}
              />
            </PDFViewer>
          </div>
          <div className={styles.modal_footer}>
            <button className="btn btn-primary" onClick={onClose}>
              Modifier
            </button>
            <PDFDownloadLink
              document={
                <AppViewBusinessViewQuotationViewPdfModalViewPdfComponent
                  business={business}
                  quotation={quotation}
                  hideAddresses={hideAddresses}
                  hideReferences={hideReferences}
                  hidePrices={hidePrices}
                  hideTotal={hideTotal}
                />
              }
              fileName={`Devis-` + quotation.number + '.pdf'}
            >
              {({ loading }) => <button className="btn btn-secondary">{loading ? 'Chargement...' : 'Télécharger'}</button>}
            </PDFDownloadLink>
            {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
              <button type="button" className="btn btn-secondary" onClick={onSendByEmailClick}>
                Envoyer par mail
              </button>
              //   <Link from={routePath} to="send-by-email" search replace resetScroll={false} preload="intent" ignoreBlocker className="btn btn-secondary">
              //     Envoyer par mail
              //   </Link>
            )}
          </div>
        </div>
      </ReactModal>
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
