import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import styles from './DatesData.module.scss';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';
import _ from 'lodash';
import { formatDateAndHourWithSlash } from '../../../../../../../../utils/functions/dates';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/dashboard');

export default function AppViewBusinessViewDashboardViewDatesDataComponent() {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  const profileIds = useMemo(() => _.uniq([business.createdBy, business.modifiedBy].filter((id) => id !== null) as Array<string>), [business]);

  const { data } = useQuery({
    ...queries.profiles.list._ctx.byIds(profileIds),
    select: (data) => ({ creater: data.find((d) => d.userId === business.createdBy), modifier: data.find((d) => d.userId === business.modifiedBy) }),
  });

  return (
    <div className={styles.headers_business_info}>
      <div className={styles.headers_business_info_content}>
        <p>
          <span>Création :</span>{' '}
          <span>
            {data?.creater?.firstName} {data?.creater?.lastName}
          </span>{' '}
          <span>{formatDateAndHourWithSlash(business.createdDate)}</span>
        </p>
        <p>
          <span>Modification :</span>{' '}
          <span>
            {data?.modifier?.firstName} {data?.modifier?.lastName}
          </span>{' '}
          <span>{formatDateAndHourWithSlash(business.modifiedDate)}</span>
        </p>
      </div>
    </div>
  );
}
