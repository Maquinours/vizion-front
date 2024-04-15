import React from 'react';
import { NumericFormat } from 'react-number-format';

type CurrencyFormatProps = Readonly<{
  value: string | number | null | undefined;
  defaultValue?: number;
  prefix?: string;
  displayType?: 'text' | 'input';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
}>;
export default function CurrencyFormat({ value, defaultValue, prefix, displayType = 'text', onChange, className }: CurrencyFormatProps) {
  return (
    <NumericFormat
      value={value}
      className={className}
      displayType={displayType}
      decimalSeparator=","
      thousandSeparator=" "
      suffix=" €"
      decimalScale={2}
      defaultValue={defaultValue}
      prefix={prefix}
      onChange={onChange}
    />
  );
}
