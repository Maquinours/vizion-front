import _ from 'lodash';
import React, { useState } from 'react';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import MailResponseDto from '../../../../utils/types/MailResponseDto';
import EmailHistoryModalComponent from '../../../EmailHistoryModal/EmailHistoryModal';
import EnterpriseModalComponentEmailModalComponent from '../EmailModal/EmailModal';
import LoaderModal from '../../../LoaderModal/LoaderModal';

const size = 15;

type EnterpriseModalComponentEmailHistoryModalComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onClose: () => void;
}>;
export default function EnterpriseModalComponentEmailHistoryModalComponent({ enterprise, onClose }: EnterpriseModalComponentEmailHistoryModalComponentProps) {
  const [page, setPage] = useState(0);
  const [addresses, setAddresses] = useState<string[]>(
    _.uniq(
      [enterprise.email, ...enterprise.profiles.map((profile) => profile.email)]
        .filter((address): address is string => !!address)
        .map((address) => address.toLowerCase()),
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
          <EnterpriseModalComponentEmailModalComponent emailId={emailModalData.email.id} onClose={() => setEmailModalData(undefined)} />
        </React.Suspense>
      )}
    </>
  );
}
