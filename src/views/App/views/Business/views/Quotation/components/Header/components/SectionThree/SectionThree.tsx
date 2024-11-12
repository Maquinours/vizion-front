import { getRouteApi } from '@tanstack/react-router';
import styles from './SectionThree.module.scss';
import AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentAddLineSectionComponent from './components/AddLineSection/AddLineSection';
import AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponent from './components/ButtonsSection/ButtonsSection';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponent() {
  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className={styles._two}>
      {business.archived ? <div></div> : <AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentAddLineSectionComponent />}
      <AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponent />
    </div>
  );
}
