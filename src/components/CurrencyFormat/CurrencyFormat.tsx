import { NumericFormat } from 'react-number-format';

type CurrencyFormatProps = Readonly<{
  value: number;
  className?: string;
}>;
export default function CurrencyFormat({ value, className }: CurrencyFormatProps) {
  return <NumericFormat value={value} className={className} displayType="text" decimalSeparator="," thousandSeparator=" " suffix=" €" decimalScale={2} />;
}
