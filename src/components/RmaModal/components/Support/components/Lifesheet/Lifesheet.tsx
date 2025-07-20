import { useState } from 'react';
import { LifesheetAssociatedItem } from '../../../../../../utils/enums/LifesheetAssociatedItem';
import AssistanceResponseDto from '../../../../../../utils/types/AssistanceResponseDto';
import LifesheetComponent from '../../../../../Lifesheet/Lifesheet';

// const routeApi = getRouteApi('/app/businesses-rma_/rma/$rmaId/support');

type RmaModalComponentSupportComponentLifesheetComponentProps = Readonly<{
  rma: AssistanceResponseDto;
  onCreateClick: () => void;
}>;
export default function RmaModalComponentSupportComponentLifesheetComponent({ rma, onCreateClick }: RmaModalComponentSupportComponentLifesheetComponentProps) {
  // const { rmaId } = routeApi.useParams();
  // const { lifesheetPage } = routeApi.useSearch();

  const [page, setPage] = useState(0);

  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.RMA}
      associatedItemId={rma.id}
      page={page}
      size={5}
      onCreateClick={onCreateClick}
      // createLink={{ to: '/app/businesses-rma/rma/$rmaId/support/create-lifesheet', params: true, search: true, replace: true, resetScroll: false }}
      onPageChange={setPage}
      // pageLink={(page) => ({ search: (old) => ({ ...old, lifesheetPage: page }), replace: true, resetScroll: false })}
      // getEmailLink={(data) => ({
      //   to: '/app/businesses-rma/rma/$rmaId/support/lifesheet-email/$lifesheetId',
      //   params: { lifesheetId: data.id },
      //   search: true,
      // })}
    />
  );
}
