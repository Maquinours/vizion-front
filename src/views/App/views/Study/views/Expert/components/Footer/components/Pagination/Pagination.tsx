import { useShallow } from 'zustand/react/shallow';
import useStore, { RFState } from '../../../Flow/utils/store';
import usePagination from '@mui/material/usePagination/usePagination';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import classNames from 'classnames';

const selector = (state: RFState) => ({
  currentPage: state.currentPage,
  pages: state.pages.map((page) => ({ type: page.type })),
  setCurrentPage: state.setCurrentPage,
});

export default function AppViewStudyViewExpertViewFooterComponentPaginationComponent() {
  const { currentPage, pages, setCurrentPage } = useStore(useShallow(selector));

  const { items } = usePagination({
    count: pages.length,
    page: currentPage + 1,
  });

  return (
    <nav className="w-full">
      <ul className="center flex h-8 w-full list-none gap-1">
        {items.map(({ page, type, selected, disabled }, index) => {
          const children = (() => {
            switch (type) {
              case 'start-ellipsis':
              case 'end-ellipsis':
                return <span>...</span>;
              case 'page':
                return (
                  <button
                    onClick={() => setCurrentPage(page! - 1)}
                    className={classNames('relative flex h-full w-full items-center justify-center text-sm font-medium', {
                      'bg-[#A60DCA] hover:bg-[#831ECC]': pages[page! - 1].type === 'synoptic',
                      'bg-[#0D6AE3] hover:bg-[#0B59BF]': pages[page! - 1].type === 'density',
                      'z-20 border-2 border-black': selected,
                    })}
                  >
                    <span className="absolute right-0 top-0 text-xs font-bold text-amber-300">{pages[page! - 1].type[0].toUpperCase()}</span>
                    <span className="font-bold text-white">{page}</span>
                  </button>
                );
              case 'previous':
                return (
                  <button onClick={() => setCurrentPage(page! - 1)} className="h-full w-full">
                    <IoIosArrowBack />
                  </button>
                );
              case 'next':
                return (
                  <button onClick={() => setCurrentPage(page! - 1)} className="h-full w-full">
                    <IoIosArrowForward />
                  </button>
                );
            }
          })();

          return (
            <li
              className={classNames(
                'my-auto box-border flex h-8 w-8 min-w-8 items-center justify-center rounded-[5px] border border-solid border-[color:var(--primary-color)] p-0 text-center text-[13px] leading-[1.43] tracking-[0.01071em] text-[rgba(0,0,0,0.87)] opacity-100 shadow-[0px_3px_5px_#10173526] hover:bg-[#10173526]',
                {
                  'bg-[var(--primary-color)] text-white': selected,
                  ['pointer-events-none text-[var(--grey-line)]']: disabled || type === 'start-ellipsis' || type === 'end-ellipsis',
                },
              )}
              key={index}
            >
              {children}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
