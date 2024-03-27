import { NumericFormat } from 'react-number-format';

type AmountFormatProps = Readonly<{ value: number | null | undefined; suffix?: string; className?: string }>;
export default function AmountFormat({ value, suffix, className }: AmountFormatProps) {
  return <NumericFormat value={value} className={className} displayType="text" decimalSeparator="," thousandSeparator=" " suffix={suffix} />;
}
