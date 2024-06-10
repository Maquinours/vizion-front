import { NumericFormatProps } from 'react-number-format';
import AmountFormat from '../AmountFormat/AmountFormat';

type CurrencyFormatProps = Readonly<Omit<NumericFormatProps, 'decimalSeparator' | 'thousandSeparator' | 'suffix' | 'decimalScale' | 'fixedDecimalScale'>>;
export default function CurrencyFormat({ ...props }: CurrencyFormatProps) {
  return <AmountFormat suffix=" €" decimalScale={2} fixedDecimalScale {...props} />;
}
