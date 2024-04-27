import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';
import styles from './SectionOne.module.scss';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/bp');

export default function AppViewBusinessViewBpViewHeaderComponentSectionOneComponent() {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className={styles.business_info}>
      <span>{business.enterpriseName}</span> / <span>{business.title}</span>
    </div>
  );
}
