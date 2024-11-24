import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import AmountFormat from '../../../../../AmountFormat/AmountFormat';

const yupSchema = yup.object({
  page: yup.number().required('Le champ page est requis'),
});

type PaginationComponentEllipsisComponentInputComponentProps = Readonly<{
  onSubmit: ({ page }: { page: number }) => void;
  onBlur: () => void;
}>;
export default function PaginationComponentEllipsisComponentInputComponent({ onSubmit, onBlur }: PaginationComponentEllipsisComponentInputComponentProps) {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(yupSchema),
  });

  return (
    <Controller
      control={control}
      name="page"
      render={({ field: { value, onChange } }) => (
        <AmountFormat
          value={value}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit(onSubmit)();
          }}
          onValueChange={(v) => onChange(Number(v.value))}
          displayType="input"
          decimalScale={0}
          allowNegative={false}
          onBlur={onBlur}
          size={3}
          className="h-full w-full text-center"
        />
      )}
    />
  );
}
