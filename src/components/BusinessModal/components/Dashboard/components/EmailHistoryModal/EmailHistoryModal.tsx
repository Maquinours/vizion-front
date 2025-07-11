import _ from 'lodash';
import React, { useState } from 'react';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import EmailHistoryModalComponent from '../../../../../EmailHistoryModal/EmailHistoryModal';
import BusinessModalComponentDashboardComponentEmailModalComponent from '../EmailModal/EmailModal';
import MailResponseDto from '../../../../../../utils/types/MailResponseDto';
import LoaderModal from '../../../../../LoaderModal/LoaderModal';

const size = 15;

type BusinessModalComponentDashboardComponentEmailHistoryModalComponentProps = Readonly<{
  business: BusinessResponseDto;
  onClose: () => void;
}>;
export default function BusinessModalComponentDashboardComponentEmailHistoryModalComponent({
  business,
  onClose,
}: BusinessModalComponentDashboardComponentEmailHistoryModalComponentProps) {
  const [page, setPage] = useState(0);
  const [addresses, setAddresses] = useState<string[]>(
    _.uniq([business.billingEmail, business.deliverEmail, business.profileEmail].filter((address): address is string => !!address)).map((address) =>
      address.toLowerCase(),
    ),
  );
  const [emailModalData, setEmailModalData] = useState<{ email: MailResponseDto }>();

  const onSubmit = ({ addresses }: { addresses: Array<string> }) => {
    setAddresses(addresses);
    setPage(0);
  };

  return (
    <>
      <EmailHistoryModalComponent
        page={page}
        size={size}
        addresses={addresses ?? []}
        onClose={onClose}
        onSubmit={onSubmit}
        onPageChange={setPage}
        onEmailClick={(email) => setEmailModalData({ email: email })}
        //   getEmailLink={getEmailLink}
        //   getPageLink={getPageLink}
      />
      {emailModalData && (
        <React.Suspense fallback={<LoaderModal />}>
          <BusinessModalComponentDashboardComponentEmailModalComponent emailId={emailModalData.email.id} onClose={() => setEmailModalData(undefined)} />
        </React.Suspense>
      )}
    </>
  );
}
