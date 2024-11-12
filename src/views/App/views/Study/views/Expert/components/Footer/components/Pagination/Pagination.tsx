import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import usePagination from '@mui/material/usePagination/usePagination';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useShallow } from 'zustand/react/shallow';
import useStore, { RFState } from '../../../Flow/utils/store';
import AppViewStudyViewExpertViewFooterComponentPaginationComponentPage from './components/Page/Page';

const selector = (state: RFState) => ({
  currentPage: state.currentPage,
  pages: state.pages,
  setCurrentPage: state.setCurrentPage,
  pageMove: state.pageMove,
});

// TODO: need to fix that and must add an ID to every page
export default function AppViewStudyViewExpertViewFooterComponentPaginationComponent() {
  const { currentPage, pages, setCurrentPage, pageMove } = useStore(useShallow(selector));

  const { items } = usePagination({
    count: pages.length,
    page: currentPage + 1,
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!!over && typeof active.id === 'string' && typeof over.id === 'string' && active.id !== over.id) pageMove(active.id, over.id);
  };

  return (
    <nav className="w-full">
      <DndContext modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
        <SortableContext items={pages} strategy={horizontalListSortingStrategy}>
          <ul className="center flex h-8 w-full list-none gap-1">
            {items.map(({ page, type, selected, disabled }, index) => {
              switch (type) {
                case 'start-ellipsis':
                case 'end-ellipsis':
                  return (
                    <li
                      key={index}
                      className="my-auto box-border flex h-8 w-8 min-w-8 items-center justify-center rounded-[5px] border border-solid border-[color:var(--primary-color)] p-0 text-center text-[13px] leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.87)] opacity-100 shadow-[0px_3px_5px_#10173526] hover:bg-[#10173526]"
                    >
                      ...
                    </li>
                  );
                case 'previous':
                  return (
                    <li
                      key={index}
                      className="my-auto box-border flex h-8 w-8 min-w-8 items-center justify-center rounded-[5px] border border-solid border-[color:var(--primary-color)] p-0 text-center text-[13px] leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.87)] opacity-100 shadow-[0px_3px_5px_#10173526] hover:bg-[#10173526]"
                    >
                      <button onClick={() => setCurrentPage(page! - 1)} className="h-full w-full">
                        <IoIosArrowBack />
                      </button>
                    </li>
                  );
                case 'next':
                  return (
                    <li
                      key={index}
                      className="my-auto box-border flex h-8 w-8 min-w-8 items-center justify-center rounded-[5px] border border-solid border-[color:var(--primary-color)] p-0 text-center text-[13px] leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.87)] opacity-100 shadow-[0px_3px_5px_#10173526] hover:bg-[#10173526]"
                    >
                      <button onClick={() => setCurrentPage(page! - 1)} className="h-full w-full">
                        <IoIosArrowForward />
                      </button>
                    </li>
                  );
                case 'page':
                  if (page !== null) {
                    const currentPage = pages[page - 1];
                    return (
                      <AppViewStudyViewExpertViewFooterComponentPaginationComponentPage
                        key={currentPage.id}
                        pageNumber={page}
                        page={currentPage}
                        selected={selected}
                        disabled={disabled}
                        setCurrentPage={setCurrentPage}
                      />
                    );
                  }
              }
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </nav>
  );
}
