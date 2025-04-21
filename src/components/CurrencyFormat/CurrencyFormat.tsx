import { NumericFormatProps } from 'react-number-format';
import AmountFormat from '../AmountFormat/AmountFormat';

type CurrencyFormatProps = Readonly<Omit<NumericFormatProps, 'decimalSeparator' | 'thousandSeparator' | 'decimalScale' | 'fixedDecimalScale'>> & {
  currency?: '€' | '$';
};
export default function CurrencyFormat({ currency = '€', ...props }: CurrencyFormatProps) {
  return <AmountFormat suffix={` ${currency}${props.suffix ?? ''}`} decimalScale={2} fixedDecimalScale {...props} />;
}
