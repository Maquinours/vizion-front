import { NumericFormat, NumericFormatProps } from 'react-number-format';

type AmountFormatProps = Readonly<Omit<NumericFormatProps, 'decimalSeparator' | 'thousandSeparator'>>;
export default function AmountFormat({ displayType = 'text', allowLeadingZeros = false, ...props }: AmountFormatProps) {
  return <NumericFormat decimalSeparator="," thousandSeparator=" " displayType={displayType} allowLeadingZeros={allowLeadingZeros} {...props} />;
}
