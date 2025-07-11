import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import styles from './SectionOne.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/bp');

type BusinessModalComponentBpComponentHeaderComponentSectionOneComponentProps = Readonly<{
  business: BusinessResponseDto;
}>;
export default function BusinessModalComponentBpComponentHeaderComponentSectionOneComponent({
  business,
}: BusinessModalComponentBpComponentHeaderComponentSectionOneComponentProps) {
  // const { businessId } = routeApi.useParams();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <div className={styles.business_info}>
      <span>{business.enterpriseName}</span> / <span>{business.title}</span>
    </div>
  );
}
