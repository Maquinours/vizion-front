import BusinessArcResponseDto from '../../../../../../utils/types/BusinessArcResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../views/App/utils/functions/getAuthentifiedUser';
import BusinessModalComponentArcComponentHeaderComponentSectionOneComponent from './components/SectionOne/SectionOne';
import BusinessModalComponentArcComponentHeaderComponentSectionThreeComponent from './components/SectionThree/SectionThree';
import BusinessModalComponentArcComponentHeaderComponentSectionTwoComponent from './components/SectionTwo/SectionTwo';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/arc');

type BusinessModalComponentArcComponentHeaderComponentProps = Readonly<{
  business: BusinessResponseDto;
  arc: BusinessArcResponseDto;
  hideReferencesPrices: boolean;
  setHideReferencesPrices: React.Dispatch<React.SetStateAction<boolean>>;
  onEditClick: () => void;
}>;
export default function BusinessModalComponentArcComponentHeaderComponent({
  business,
  arc,
  hideReferencesPrices,
  setHideReferencesPrices,
  onEditClick,
}: BusinessModalComponentArcComponentHeaderComponentProps) {
  // const { businessId } = routeApi.useParams();

  const { data: user } = useAuthentifiedUserQuery();
  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return (
    <>
      {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
        <BusinessModalComponentArcComponentHeaderComponentSectionOneComponent business={business} arc={arc} onEditClick={onEditClick} />
      )}
      <BusinessModalComponentArcComponentHeaderComponentSectionTwoComponent
        business={business}
        arc={arc}
        hideReferencesPrices={hideReferencesPrices}
        setHideReferencesPrices={setHideReferencesPrices}
      />
      {!business.archived && <BusinessModalComponentArcComponentHeaderComponentSectionThreeComponent business={business} arc={arc} />}
    </>
  );
}
