import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import BusinessSubQuotationResponseDto from '../../../../../../../../../../utils/types/BusinessSubQuotationResponseDto';
import React from 'react';

type AppViewBusinessViewQuotationViewTableComponentSubQuotationRowComponentProps = Readonly<{
  subQuotation: BusinessSubQuotationResponseDto;
  onContextMenu: (e: React.MouseEvent, item: BusinessSubQuotationResponseDto) => void;
}>;
export default function AppViewBusinessViewQuotationViewTableComponentSubQuotationRowComponent({
  subQuotation,
  onContextMenu,
}: AppViewBusinessViewQuotationViewTableComponentSubQuotationRowComponentProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: subQuotation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: 'flex',
    alignItems: 'center',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <tr ref={setNodeRef} style={style} onContextMenu={(e) => onContextMenu(e, subQuotation)} {...attributes} {...listeners}>
      <td colSpan={5} style={{ textAlign: 'start', width: '100%' }}>
        <span style={{ cursor: 'pointer' }}>{subQuotation.name}</span>
      </td>
    </tr>
  );
}
