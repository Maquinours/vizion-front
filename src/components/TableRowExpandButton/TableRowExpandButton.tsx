import { Row } from '@tanstack/react-table';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import styles from './TableRowExpandButton.module.scss';
import classNames from 'classnames';

type TableRowExpandButtonComponentProps<T> = Readonly<{
  row: Row<T>;
}>;
export default function TableRowExpandButtonComponent<T>({ row }: TableRowExpandButtonComponentProps<T>) {
  if (row.getCanExpand())
    return (
      <button
        className={classNames('btn btn-primary', styles.button)}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          row.getToggleExpandedHandler()();
        }}
      >
        {row.getIsExpanded() ? <RiArrowDropUpLine size="25" /> : <RiArrowDropDownLine size="25" />}
      </button>
    );
}
