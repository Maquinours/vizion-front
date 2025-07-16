// import { getRouteApi } from '@tanstack/react-router';
// import LifesheetComponent from '../../../Lifesheet/Lifesheet';
// import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';

import { useState } from 'react';
import { LifesheetAssociatedItem } from '../../../../utils/enums/LifesheetAssociatedItem';
import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import LifesheetComponent from '../../../Lifesheet/Lifesheet';

// const routeApi = getRouteApi('/app/enterprises_/$enterpriseId');
// const routePath = '/app/enterprises/$enterpriseId';

type EnterpriseModalComponentLifesheetComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onCreateClick: () => void;
}>;
export default function EnterpriseModalComponentLifesheetComponent({ enterprise, onCreateClick }: EnterpriseModalComponentLifesheetComponentProps) {
  // const { enterpriseId } = routeApi.useParams();
  // const { lifesheetPage: page } = routeApi.useSearch();

  const [page, setPage] = useState(0);

  return (
    <LifesheetComponent
      associatedItemType={LifesheetAssociatedItem.ENTERPRISE}
      associatedItemId={enterprise.id}
      page={page}
      onPageChange={setPage}
      onCreateClick={onCreateClick}
      // pageLink={(page) => ({ from: routePath, search: (old) => ({ ...old, lifesheetPage: page }), replace: true, resetScroll: false })}
      // createLink={{
      //   from: routePath,
      //   to: '/app/enterprises/$enterpriseId/create-lifesheet-comment',
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      // }}
      // getEmailLink={(data) => ({
      //   from: routePath,
      //   to: '/app/enterprises/$enterpriseId/lifesheet-email/$lifesheetId',
      //   params: { lifesheetId: data.id },
      //   search: true,
      //   replace: true,
      //   resetScroll: false,
      // })}
    />
  );
}
