import { NumericFormatProps } from 'react-number-format';
import AmountFormat from '../AmountFormat/AmountFormat';

type CurrencyFormatProps = Readonly<Omit<NumericFormatProps, 'decimalSeparator' | 'thousandSeparator' | 'suffix' | 'decimalScale' | 'fixedDecimalScale'>> & {
  currency?: '€' | '$';
};
export default function CurrencyFormat({ currency = '€', ...props }: CurrencyFormatProps) {
  return <AmountFormat suffix={` ${currency}`} decimalScale={2} fixedDecimalScale {...props} />;
}
