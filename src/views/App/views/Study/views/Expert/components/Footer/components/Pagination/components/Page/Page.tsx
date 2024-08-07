import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';

type AppViewStudyViewExpertViewFooterComponentPaginationComponentPageProps = Readonly<{
  pageNumber: number;
  selected: boolean;
  disabled: boolean;
  setCurrentPage: (page: number) => void;
  page: { id: string; type: 'synoptic' | 'density' };
}>;
export default function AppViewStudyViewExpertViewFooterComponentPaginationComponentPage({
  pageNumber,
  selected,
  disabled,
  setCurrentPage,
  page,
}: AppViewStudyViewExpertViewFooterComponentPaginationComponentPageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    // translate: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={classNames(
        'my-auto box-border flex h-8 w-8 min-w-8 items-center justify-center rounded-[5px] border border-solid border-[color:var(--primary-color)] p-0 text-center text-[13px] leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.87)] opacity-100 shadow-[0px_3px_5px_#10173526] hover:bg-[#10173526]',
        {
          'bg-[var(--primary-color)] text-white': selected,
          ['pointer-events-none text-[var(--grey-line)]']: disabled,
        },
      )}
    >
      <button
        onClick={() => setCurrentPage(pageNumber - 1)}
        className={classNames('relative flex h-full w-full items-center justify-center text-sm font-medium', {
          'bg-[#A60DCA] hover:bg-[#831ECC]': page.type === 'synoptic',
          'bg-[#0D6AE3] hover:bg-[#0B59BF]': page.type === 'density',
          'z-20 border-2 border-black': selected,
        })}
      >
        <span className="absolute right-0 top-0 text-xs font-bold text-amber-300">{page.type[0].toUpperCase()}</span>
        <span className="font-bold text-white">{pageNumber}</span>
      </button>
    </li>
  );
}
