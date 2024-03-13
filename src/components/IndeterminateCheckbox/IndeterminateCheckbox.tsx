import { HTMLProps, useEffect, useRef } from 'react';

type IndeterminateCheckboxProps = Readonly<HTMLProps<HTMLInputElement> & { indeterminate?: boolean }>;

export default function IndeterminateCheckboxComponent({ indeterminate, ...rest }: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, rest.checked, indeterminate]);

  return <input type="checkbox" ref={ref} {...rest} />;
}
