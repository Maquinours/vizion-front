import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { queries } from '../../../../../../../../../../../../../../utils/constants/queryKeys';
import * as ExcelJS from 'exceljs';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/businesses-rma_/business/$businessId/quotation');

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponentExportButton() {
  const queryClient = useQueryClient();

  const { businessId } = routeApi.useParams();

  const { data: business } = useSuspenseQuery(queries['businesses'].detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'VIZEO';
      const worksheet = workbook.addWorksheet('Feuille_1');
      worksheet.properties.defaultRowHeight = 20;
      worksheet.properties.defaultColWidth = 2;
      worksheet.columns = [
        {
          header: 'Référence',
          key: 'ref',
          width: 30,
          style: { font: { size: 13 } },
          alignment: { horizontal: 'center', vertical: 'middle' },
        },
        {
          header: 'Désignation',
          key: 'designation',
          width: 100,
          style: { font: { size: 13 } },
          alignment: { horizontal: 'center', vertical: 'middle' },
        },
        {
          header: 'Quantité',
          key: 'qty',
          width: 20,
          style: { font: { size: 13 } },
          alignment: { horizontal: 'center', vertical: 'middle' },
        },
        {
          header: 'Prix Net',
          key: 'price',
          width: 20,
          style: { font: { size: 13 } },
          alignment: { horizontal: 'center', vertical: 'middle' },
        },
        {
          header: 'Total',
          key: 'total',
          width: 20,
          style: { font: { size: 13 } },
          alignment: { horizontal: 'center', vertical: 'middle' },
        },
        {
          header: 'Prix revient en €',
          key: 'costPrice',
          width: 30,
          style: { font: { size: 13 } },
          alignment: { horizontal: 'center', vertical: 'middle' },
        },
      ];
      worksheet.getRow(1).font = {
        bold: true,
        size: 16,
        color: { argb: 'FF31385a' },
      };

      const products = await queryClient.ensureQueryData(queries.product.list);
      quotation?.subQuotationList?.forEach((el) => {
        if (String(el.name).toUpperCase() === 'DEFAULT') {
          el.quotationDetails?.forEach((item) => {
            const product = products.find((product) => product.reference === item.productReference);
            const details = {
              ref: item.productReference,
              designation: item.productDesignation,
              qty: item.quantity,
              price: item.publicUnitPrice,
              total: item.totalPrice,
              costPrice: product?.purchasePriceEUR,
            };
            worksheet.addRow(Object.values(details));
            worksheet.getCell(`D${worksheet.rowCount}`).numFmt = '#,##0.00 €';
            worksheet.getCell(`E${worksheet.rowCount}`).numFmt = '#,##0.00 €';
            worksheet.getCell(`F${worksheet.rowCount}`).numFmt = '#,##0.00 €';
          });
        } else {
          worksheet.addRow([el.name]).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          worksheet.mergeCells(worksheet.rowCount, 1, worksheet.rowCount, worksheet.columnCount);

          el.quotationDetails?.forEach((item) => {
            const product = products.find((product) => product.reference === item.productReference);
            const details = {
              ref: item.productReference,
              designation: item.productDesignation,
              qty: item.quantity,
              price: item.publicUnitPrice,
              total: item.totalPrice,
              costPrice: product?.purchasePriceEUR,
            };
            worksheet.addRow(Object.values(details));
            worksheet.getCell(`D${worksheet.rowCount}`).numFmt = '#,##0.00 €';
            worksheet.getCell(`E${worksheet.rowCount}`).numFmt = '#,##0.00 €';
            worksheet.getCell(`F${worksheet.rowCount}`).numFmt = '#,##0.00 €';
          });

          worksheet.addRow([`Total ${el.name} : ${el.quotationDetails?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0).toFixed(2)} €`]).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          };

          worksheet.mergeCells(worksheet.rowCount, 1, worksheet.rowCount, worksheet.columnCount);
        }
      });

      worksheet.addRow([`Total Général HT: ${quotation!.totalAmountHT} €`]).alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };
      worksheet.mergeCells(worksheet.rowCount, 1, worksheet.rowCount, worksheet.columnCount);

      worksheet.addRow([`Frais de port : ${quotation!.shippingServicePrice} €`]).alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };

      worksheet.mergeCells(worksheet.rowCount, 1, worksheet.rowCount, worksheet.columnCount);
      return workbook.xlsx.writeBuffer();
    },
    onSuccess: (data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `DEVIS_${business.numBusiness}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'export");
    },
  });

  return (
    <button onClick={() => mutate()} disabled={isPending} className="btn btn-primary">
      {isPending ? 'Export en cours...' : 'Exporter'}
    </button>
  );
}
