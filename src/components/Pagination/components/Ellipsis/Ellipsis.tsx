import { useState } from 'react';
import PaginationComponentEllipsisComponentButtonComponent from './components/Button/Button';
import PaginationComponentEllipsisComponentInputComponent from './components/Input/Input';

type PaginationComponentEllipsisComponentProps = Readonly<{
  totalPages: number;
  changePage: (page: number) => void;
}>;
export default function PaginationComponentEllipsisComponent({ totalPages, changePage }: PaginationComponentEllipsisComponentProps) {
  const [step, setStep] = useState<'button' | 'input'>('button');

  switch (step) {
    case 'button': {
      const onButtonClick = () => {
        setStep('input');
      };
      return <PaginationComponentEllipsisComponentButtonComponent onClick={onButtonClick} />;
    }
    case 'input': {
      const onSubmit = ({ page }: { page: number }) => {
        if (!Number.isSafeInteger(page) || page < 1 || page > totalPages) return;
        setStep('button');
        changePage(page - 1);
      };
      const onInputBlur = () => {
        setStep('button');
      };
      return <PaginationComponentEllipsisComponentInputComponent onSubmit={onSubmit} onBlur={onInputBlur} />;
    }
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
