import { useSuspenseQuery } from '@tanstack/react-query';
import { Control } from 'react-hook-form';
import { queries } from '../../../../utils/constants/queryKeys';
import { CreateLifesheetSchema } from '../../CreateLifesheetModal';
import CreateLifesheetModalComponentConcernedSectionComponent from '../ConcernedSection/ConcernedSection';

type CreateLifesheetModalComponentBusinessConcernedSectionComponentProps = Readonly<{
  businessId: string;
  control: Control<CreateLifesheetSchema>;
}>;
export default function CreateLifesheetModalComponentBusinessConcernedSectionComponent({
  businessId,
  control,
}: CreateLifesheetModalComponentBusinessConcernedSectionComponentProps) {
  const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));

  return <CreateLifesheetModalComponentConcernedSectionComponent enterpriseId={business.enterpriseId} control={control} />;
}
