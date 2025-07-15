import { closestCenter, DndContext, KeyboardSensor, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { VirtualElement } from '@popperjs/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { reorderBusinessSubQuotation } from '../../../../../../utils/api/businessSubQuotations';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessQuotationDetailsResponseDto from '../../../../../../utils/types/BusinessQuotationDetailsResponseDto';
import BusinessQuotationResponseDto from '../../../../../../utils/types/BusinessQuotationResponseDto';
import BusinessResponseDto from '../../../../../../utils/types/BusinessResponseDto';
import BusinessSubQuotationResponseDto from '../../../../../../utils/types/BusinessSubQuotationResponseDto';
import CurrencyFormat from '../../../../../CurrencyFormat/CurrencyFormat';
import AppViewBusinessViewQuotationViewTableComponentQuotationDetailContextMenuComponent from './components/QuotationDetailContextMenu/QuotationDetailContextMenu';
import AppViewBusinessViewQuotationViewTableComponentQuotationDetailRowComponent from './components/QuotationDetailRow/QuotationDetailRow';
import AppViewBusinessViewQuotationViewTableComponentSubQuotationContextMenuComponent from './components/SubQuotationContextMenu/SubQuotationContextMenu';
import AppViewBusinessViewQuotationViewTableComponentSubQuotationRowComponent from './components/SubQuotationRow/SubQuotationRow';
import styles from './Table.module.scss';

// const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');

const getAnchor = (e: React.MouseEvent) => {
  return {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      x: e.clientX,
      y: e.clientY,
      top: e.clientY,
      right: e.clientX,
      bottom: e.clientY,
      left: e.clientX,
      toJSON: () => {},
    }),
  };
};

type BusinessModalComponentQuotationComponentTableComponentProps = Readonly<{
  business: BusinessResponseDto;
  quotation: BusinessQuotationResponseDto;
  hideReferences: boolean;
  hidePrices: boolean;
  hideTotal: boolean;
  onCreateDetailClick: (subQuotation: BusinessSubQuotationResponseDto) => void;
  onUpdateSubQuotationClick: (subQuotation: BusinessSubQuotationResponseDto) => void;
  onDeleteSubQuotationClick: (subQuotation: BusinessSubQuotationResponseDto) => void;
  onCreateAssociatedDetailClick: (detail: BusinessQuotationDetailsResponseDto) => void;
  onUpdateDetailClick: (detail: BusinessQuotationDetailsResponseDto) => void;
  onDeleteDetailClick: (detail: BusinessQuotationDetailsResponseDto) => void;
}>;
export default function BusinessModalComponentQuotationComponentTableComponent({
  business,
  quotation,
  hideReferences,
  hidePrices,
  hideTotal,
  onCreateDetailClick,
  onUpdateSubQuotationClick,
  onDeleteSubQuotationClick,
  onCreateAssociatedDetailClick,
  onUpdateDetailClick,
  onDeleteDetailClick,
}: BusinessModalComponentQuotationComponentTableComponentProps) {
  const queryClient = useQueryClient();

  // const { businessId } = routeApi.useParams();
  // const { hideTotal } = routeApi.useSearch();

  // const { data: business } = useSuspenseQuery(queries.businesses.detail._ctx.byId(businessId));
  // const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const [subquotationContextMenuAnchor, setSubquotationContextMenuAnchor] = useState<VirtualElement>();
  const [subquotation, setSubquotation] = useState<BusinessSubQuotationResponseDto>();
  const [quotationDetailContextMenuAnchor, setQuotationDetailContextMenuAnchor] = useState<VirtualElement>();
  const [quotationDetail, setQuotationDetail] = useState<BusinessQuotationDetailsResponseDto>();

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  const dataIds = useMemo<Array<UniqueIdentifier>>(() => quotation.subQuotationList?.map(({ id }) => id) ?? [], [quotation]);

  const { mutate } = useMutation({
    mutationFn: ({ id, orderNum }: { id: string; orderNum: number }) => reorderBusinessSubQuotation({ id, orderNum }),
    onMutate: ({ id, orderNum }) => {
      queryClient.setQueryData<BusinessQuotationResponseDto>(queries['business-quotations'].detail._ctx.byBusinessId(business.id).queryKey, (old) => {
        if (!old || !old.subQuotationList) return old;
        const oldIndex = old.subQuotationList.findIndex((subQuotation) => subQuotation.id === id);
        const newIndex = orderNum;
        const newSubList = arrayMove(old.subQuotationList!, oldIndex, newIndex).map((subQuotation, index) => ({ ...subQuotation, orderNum: index.toString() }));
        return { ...old, subQuotationList: newSubList };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries['business-quotations'].detail._ctx.byBusinessId(business.id).queryKey });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      mutate({ id: active.id as string, orderNum: dataIds.indexOf(over.id) });
    }
  };

  const onSubQuotationRowContextMenu = (e: React.MouseEvent, subQuotation: BusinessSubQuotationResponseDto) => {
    if (business.archived) return;
    e.preventDefault();
    setSubquotation(subQuotation);
    setQuotationDetailContextMenuAnchor(undefined);
    setSubquotationContextMenuAnchor(getAnchor(e));
  };

  const onQuotationDetailRowContextMenu = (e: React.MouseEvent, detail: BusinessQuotationDetailsResponseDto) => {
    if (business.archived) return;
    e.preventDefault();
    setQuotationDetail(detail);
    setSubquotationContextMenuAnchor(undefined);
    setQuotationDetailContextMenuAnchor(getAnchor(e));
  };

  const subQuotations = useMemo(
    () => quotation.subQuotationList?.sort((a, b) => parseInt(a.orderNum ?? '', 10) - parseInt(b.orderNum ?? '', 10)),
    [quotation.subQuotationList],
  );

  return (
    <>
      <div className={styles.table_container}>
        <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Stock ce jour</th>
                <th>Prix</th>
                <th>Remise</th>
                <th>Prix unitaire</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                {subQuotations?.map((subQuotation, _index, arr) => (
                  <React.Fragment key={subQuotation.id}>
                    {subQuotation.name === 'Default' && (!subQuotation.quotationDetails || subQuotation.quotationDetails.length === 0) && arr.length === 1 && (
                      <tr>
                        <td colSpan={9}>
                          <div className={styles.no_data}>Aucun détail disponible.</div>
                        </td>
                      </tr>
                    )}
                    {subQuotation.name !== 'Default' && (
                      <AppViewBusinessViewQuotationViewTableComponentSubQuotationRowComponent
                        subQuotation={subQuotation}
                        onContextMenu={onSubQuotationRowContextMenu}
                      />
                    )}
                    {subQuotation.quotationDetails?.map((detail) => (
                      <AppViewBusinessViewQuotationViewTableComponentQuotationDetailRowComponent
                        key={detail.id}
                        detail={detail}
                        onContextMenu={onQuotationDetailRowContextMenu}
                        hideReferences={hideReferences}
                        hidePrices={hidePrices}
                      />
                    ))}
                    {subQuotation.name !== 'Default' && !hideTotal && (
                      <tr>
                        <td colSpan={8} style={{ width: '88%', textAlign: 'right' }}>
                          SOUS TOTAL {subQuotation.name} HT
                        </td>
                        <td colSpan={1} style={{ width: '12%', textAlign: 'center' }}>
                          <CurrencyFormat value={subQuotation.quotationDetails?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0)} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>
      <AppViewBusinessViewQuotationViewTableComponentSubQuotationContextMenuComponent
        anchorElement={subquotationContextMenuAnchor}
        setAnchorElement={setSubquotationContextMenuAnchor}
        item={subquotation}
        onCreateDetailClick={onCreateDetailClick}
        onUpdateSubQuotationClick={onUpdateSubQuotationClick}
        onDeleteSubQuotationClick={onDeleteSubQuotationClick}
      />
      <AppViewBusinessViewQuotationViewTableComponentQuotationDetailContextMenuComponent
        anchorElement={quotationDetailContextMenuAnchor}
        setAnchorElement={setQuotationDetailContextMenuAnchor}
        item={quotationDetail}
        onCreateAssociatedDetailClick={onCreateAssociatedDetailClick}
        onUpdateDetailClick={onUpdateDetailClick}
        onDeleteDetailClick={onDeleteDetailClick}
      />
    </>
  );
}
