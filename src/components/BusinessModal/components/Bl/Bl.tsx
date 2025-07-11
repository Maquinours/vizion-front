import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { queries } from '../../../../utils/constants/queryKeys';
import BusinessResponseDto from '../../../../utils/types/BusinessResponseDto';
import PaginationComponent from '../../../Pagination/Pagination';
import styles from './Bl.module.scss';
import BusinessModalComponentBlComponentBodyComponent from './components/Body/Body';
import BusinessModalComponentBlComponentHeaderComponent from './components/Header/Header';
import SendEmailModalComponent from '../../../SendEmailModal/SendEmailModal';
import _ from 'lodash';
import AppViewBusinessViewBlViewBodyComponentPdfComponent from './components/Body/components/Pdf/Pdf';
import { pdf } from '@react-pdf/renderer';
import { formatFileName } from '../../../../utils/functions/files';
import LoaderModal from '../../../LoaderModal/LoaderModal';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bl');
// const routePath = '/app/businesses-rma/business/$businessId/bl';

enum ModalType {
  LOADING,
  SEND_BY_EMAIL,
}

type ModalData = { modal: ModalType.LOADING } | { modal: ModalType.SEND_BY_EMAIL; file: File };

type BusinessModalComponentBlComponentProps = Readonly<{
  business: BusinessResponseDto;
}>;
export default function BusinessModalComponentBlComponent({ business }: BusinessModalComponentBlComponentProps) {
  // const { businessId } = routeApi.useParams();
  // const { page } = routeApi.useSearch();

  const { data: bls } = useSuspenseQuery(queries['business-bls'].list._ctx.byBusinessId(business.id));

  const [page, setPage] = useState(0);
  const [modalData, setModalData] = useState<ModalData>();

  const modal = useMemo(() => {
    switch (modalData?.modal) {
      case ModalType.LOADING:
        return <LoaderModal />;
      case ModalType.SEND_BY_EMAIL:
        const bl = bls.at(page);
        if (!bl) return;
        const defaultRecipient = _.uniq(
          [business.billingEmail, business.deliverEmail, business.profileEmail].filter((email): email is string => !!email).map((email) => email.toLowerCase()),
        );

        return (
          <SendEmailModalComponent
            isOpen
            onClose={() => setModalData(undefined)}
            defaultRecipient={defaultRecipient}
            defaultSubject={bl.number}
            defaultAttachments={[modalData.file]}
            lifeSheetInfoDto={{
              businessNumber: business.numBusiness,
              businessName: business.title ?? '',
              businessId: business.id,
            }}
            storageKey={`business-modal-bl-${business.id}`}
          />
        );
    }
  }, [modalData, business, bls, page]);

  const onSendByEmailClick = async () => {
    setModalData({ modal: ModalType.LOADING });

    const bl = bls[page];
    if (!bl) return;
    const blob = await pdf(<AppViewBusinessViewBlViewBodyComponentPdfComponent business={business} bl={bl} />).toBlob();
    const file = new File([blob], formatFileName(`${bl.number}.pdf`), {
      type: blob.type,
    });
    setModalData({ modal: ModalType.SEND_BY_EMAIL, file });
  };

  return (
    <>
      <div className={styles.container}>
        <BusinessModalComponentBlComponentHeaderComponent business={business} />
        <BusinessModalComponentBlComponentBodyComponent business={business} bls={bls} page={page} onSendByEmailClick={onSendByEmailClick} />
        <div>
          <PaginationComponent
            page={page}
            totalPages={bls.length}
            // pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, page }), replace: true, resetScroll: false })}
            onPageChange={setPage}
          />
        </div>
      </div>
      {modal}
      {/* <Outlet /> */}
    </>
  );
}
