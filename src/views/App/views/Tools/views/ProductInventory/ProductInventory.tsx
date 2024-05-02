import { useQuery } from '@tanstack/react-query';
import { Outlet, getRouteApi } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import PaginationComponent from '../../../../../../components/Pagination/Pagination';
import { queries } from '../../../../../../utils/constants/queryKeys';
import ProductVersionShelfStockResponseDto from '../../../../../../utils/types/ProductVersionShelfStockResponseDto';
import styles from './ProductInventory.module.scss';
import AppViewToolsViewProductInventoryViewButtonsComponent from './components/Buttons/Buttons';
import AppViewToolsViewProductInventoryViewSearchSectionComponent from './components/SearchSection/SearchSection';
import AppViewToolsViewProductInventoryViewTableComponent from './components/Table/Table';
import { ProductInventoryContext } from './utils/context/context';

const size = 20;

const routeApi = getRouteApi('/app/tools/product-inventory');

export default function AppViewToolsViewProductInventoryView() {
  const { page } = routeApi.useSearch();

  const [data, setData] = useState<{ stock: ProductVersionShelfStockResponseDto; comptedStock: number }[]>([]);

  const { data: stocks, isLoading } = useQuery(queries['product-version-shelf-stocks'].page._ctx.all({ page, size }));

  const setCountedNumber = (index: number, value: number) => {
    const newData = [...data];
    newData[index].comptedStock = value;
    setData(newData);
  };

  const resetData = () => {
    setData(stocks?.content.map((stock) => ({ stock, comptedStock: stock.currentStock ?? 0 })) ?? []);
  };

  const contextValue = useMemo(() => ({ data }), [data]);

  useEffect(() => {
    if (stocks) setData(stocks.content.map((stock) => ({ stock, comptedStock: stock.currentStock ?? 0 })));
  }, [stocks]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <AppViewToolsViewProductInventoryViewSearchSectionComponent />
          <AppViewToolsViewProductInventoryViewButtonsComponent resetData={resetData} />
        </div>
        <AppViewToolsViewProductInventoryViewTableComponent data={data} isLoading={isLoading} setComptedNumber={setCountedNumber} />
        <div className={styles.pagination}>
          <PaginationComponent page={page} totalPages={stocks?.totalPages} pageLink={(page) => ({ search: (old) => ({ ...old, page }) })} />
        </div>
      </div>
      <ProductInventoryContext.Provider value={contextValue}>
        <Outlet />
      </ProductInventoryContext.Provider>
    </>
  );
}
