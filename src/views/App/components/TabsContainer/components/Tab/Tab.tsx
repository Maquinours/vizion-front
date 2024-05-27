import { useSortable } from '@dnd-kit/sortable';
import { Tab } from '../../TabsContainer';
import { Link } from '@tanstack/react-router';
import { MdClose } from 'react-icons/md';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

type AppViewTabsContainerComponentTabComponentProps = Readonly<{
  tab: Tab;
  onCloseTab: (e: React.MouseEvent, tab: Tab) => void;
}>;
export default function AppViewTabsContainerComponentTabComponent({ tab, onCloseTab }: AppViewTabsContainerComponentTabComponentProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id, disabled: tab.initial });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    // translate: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Link
        {...tab.route}
        disabled={isDragging}
        className="flex h-8 w-auto max-w-[auto] items-center justify-between border-r-[1.5px] border-solid border-r-[color:var(--white-color)] bg-[color:var(--bg-color)] text-left font-[DIN2014] text-sm not-italic leading-[18px] tracking-[0px] text-[color:var(--primary-color)] no-underline"
        activeOptions={{ exact: true, includeSearch: false }}
        activeProps={{ className: 'bg-[color:var(--white-color)] rounded-tr-[5px] border-r-[none]' }}
        style={{ pointerEvents: isDragging ? 'none' : undefined }}
      >
        <span className="flex h-full w-full items-center py-0 pl-2 pr-8">{tab.name}</span>
        {(tab.closable === undefined || tab.closable) && (
          <button disabled={isDragging} onClick={(e) => onCloseTab(e, tab)}>
            <MdClose className="font-[bold] text-[17px] text-[color:var(--primary-color)]" />
          </button>
        )}
      </Link>
    </div>
  );
}
