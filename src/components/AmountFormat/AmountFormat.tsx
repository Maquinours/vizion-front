import React from 'react';
import { NumericFormat } from 'react-number-format';

type AmountFormatProps = Readonly<{
  value: number | null | undefined;
  suffix?: string;
  displayType?: 'text' | 'input';
  decimalScale?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
}>;
export default function AmountFormat({ value, suffix, displayType = 'text', decimalScale, onChange, className, style }: AmountFormatProps) {
  return (
    <NumericFormat
      value={value}
      className={className}
      displayType={displayType}
      onChange={onChange}
      decimalScale={decimalScale}
      decimalSeparator=","
      thousandSeparator=" "
      suffix={suffix}
      style={style}
    />
  );
}
