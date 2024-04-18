import React from 'react';
import { NumericFormat } from 'react-number-format';

type AmountFormatProps = Readonly<{
  value: number | null | undefined;
  suffix?: string;
  displayType?: 'text' | 'input';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}>;
export default function AmountFormat({ value, suffix, displayType = 'text', onChange, className }: AmountFormatProps) {
  return (
    <NumericFormat
      value={value}
      className={className}
      displayType={displayType}
      onChange={onChange}
      decimalSeparator=","
      thousandSeparator=" "
      suffix={suffix}
    />
  );
}
