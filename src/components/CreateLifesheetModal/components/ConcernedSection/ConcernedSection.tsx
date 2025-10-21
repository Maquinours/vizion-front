import { useSuspenseQuery } from '@tanstack/react-query';
import CustomSelect from '../../../CustomSelect/CustomSelect';
import { queries } from '../../../../utils/constants/queryKeys';
import { Control, Controller } from 'react-hook-form';
import { CreateLifesheetSchema } from '../../CreateLifesheetModal';

type CreateLifesheetModalComponentConcernedSectionComponentProps = Readonly<{
  enterpriseId: string;
  control: Control<CreateLifesheetSchema>;
}>;
export default function CreateLifesheetModalComponentConcernedSectionComponent({
  enterpriseId,
  control,
}: CreateLifesheetModalComponentConcernedSectionComponentProps) {
  const { data: profiles } = useSuspenseQuery(queries.profiles.list._ctx.byEnterpriseId(enterpriseId));

  return (
    <div className="mb-4 flex items-center gap-x-1">
      <label>Qui :</label>
      <Controller
        control={control}
        name="concerned"
        render={({ field: { value, onBlur, onChange } }) => (
          <CustomSelect
            options={profiles}
            getOptionValue={(opt) => opt.id}
            getOptionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Sélectionnez un profil"
            isClearable
          />
        )}
      />
    </div>
  );
}
