import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import AmountFormat from '../../../AmountFormat/AmountFormat';

const yupSchema = yup.object({
  page: yup.number().required('Le champ page est requis').min(1).max(yup.ref('totalPages')),
  totalPages: yup.number(),
});

type PaginationComponentEllipsisComponentProps = Readonly<{
  totalPages: number;
  changePage: (page: number) => void;
}>;
export default function PaginationComponentEllipsisComponent({ totalPages, changePage }: PaginationComponentEllipsisComponentProps) {
  const [step, setStep] = useState<'button' | 'input'>('button');

  const { control, setValue, handleSubmit, reset } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onButtonClick = () => {
    setStep('input');
  };

  const onInputBlur = () => {
    setStep('button');
    reset();
  };

  const onSubmit = (data: yup.InferType<typeof yupSchema>) => {
    changePage(data.page - 1);
  };

  useEffect(() => {
    setValue('totalPages', totalPages);
  }, [totalPages]);

  switch (step) {
    case 'button':
      return (
        <button type="button" onClick={onButtonClick} className="h-full w-full">
          ...
        </button>
      );
    case 'input':
      return (
        <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full">
          <Controller
            control={control}
            name="page"
            render={({ field: { value, onChange } }) => (
              <AmountFormat
                value={value}
                onValueChange={(v) => onChange(Number(v.value))}
                displayType="input"
                decimalScale={0}
                allowNegative={false}
                onBlur={onInputBlur}
                size={3}
                autoFocus
                className="h-full w-full text-center"
              />
            )}
          />
        </form>
      );
  }

  //   return (
  //     <>
  //       {step === 'button' && (
  //         <button type="button" onClick={onButtonClick} style={{ visibility: step !== 'button' ? 'hidden' : undefined }} className="h-full w-full">
  //           ...
  //         </button>
  //       )}
  //       <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full" style={{ visibility: step !== 'input' ? 'hidden' : undefined }}>
  //         <Controller
  //           control={control}
  //           name="page"
  //           render={({ field: { value, onChange } }) => (
  //             <AmountFormat
  //               min={1}
  //               max={totalPages}
  //               value={value}
  //               onValueChange={(v) => onChange(Number(v.value))}
  //               displayType="input"
  //               getInputRef={inputRef}
  //               onBlur={onInputBlur}
  //               size={5}
  //               className="h-full w-full"
  //               autoFocus
  //             />
  //           )}
  //         />
  //       </form>
  //     </>
  //   );
}
