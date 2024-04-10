import { NumericFormat } from 'react-number-format';

type CurrencyFormatProps = Readonly<{
  value: string | number | null | undefined;
  defaultValue?: number;
  className?: string;
}>;
export default function CurrencyFormat({ value, defaultValue, className }: CurrencyFormatProps) {
  return (
    <NumericFormat
      value={value}
      className={className}
      displayType="text"
      decimalSeparator=","
      thousandSeparator=" "
      suffix=" €"
      decimalScale={2}
      defaultValue={defaultValue}
    />
  );
}
