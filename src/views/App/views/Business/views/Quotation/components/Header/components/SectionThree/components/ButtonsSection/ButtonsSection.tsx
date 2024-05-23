import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './ButtonsSection.module.scss';
import * as ExcelJS from 'exceljs';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/quotation');

export default function AppViewBusinessViewQuotationViewHeaderComponentSectionThreeComponentButtonsSectionComponent() {
  const { businessId } = routeApi.useParams();
  const { hideTotal, hideReferences, hidePrices, hideAddresses } = routeApi.useSearch();

  const { data: user } = useAuthentifiedUserQuery();

  const { data: business } = useSuspenseQuery(queries['businesses'].detail._ctx.byId(businessId));
  const { data: quotation } = useSuspenseQuery(queries['business-quotations'].detail._ctx.byBusinessId(businessId));

  const onExport = () => {
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
      },
      {
        header: 'Désignation',
        key: 'designation',
        width: 100,
        style: { font: { size: 13 } },
      },
      {
        header: 'Quantité',
        key: 'qty',
        width: 20,
        style: { font: { size: 13 } },
      },
      {
        header: 'Prix Net',
        key: 'price',
        width: 20,
        style: { font: { size: 13 } },
      },
      {
        header: 'Total',
        key: 'total',
        width: 20,
        style: { font: { size: 13 } },
      },
    ];
    worksheet.getRow(1).font = {
      bold: true,
      size: 16,
      color: { argb: 'FF31385a' },
    };

    quotation?.subQuotationList?.forEach((el) => {
      if (String(el.name).toUpperCase() === 'DEFAULT') {
        el.quotationDetails?.forEach((item) => {
          const details = {
            ref: item.productReference,
            designation: item.productDesignation,
            qty: item.quantity,
            price: `${item.publicUnitPrice} €`,
            total: `${item.totalPrice} €`,
          };
          worksheet.addRow(Object.values(details));
        });
      } else {
        worksheet.addRow([el.name]).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
        worksheet.mergeCells(worksheet.rowCount, 1, worksheet.rowCount, worksheet.columnCount);

        el.quotationDetails?.forEach((item) => {
          const details = {
            ref: item.productReference,
            designation: item.productDesignation,
            qty: item.quantity,
            price: `${item.publicUnitPrice} €`,
            total: `${item.totalPrice} €`,
          };
          worksheet.addRow(Object.values(details));
        });

        worksheet.addRow([`Total ${el.name} : ${el.quotationDetails?.reduce((acc, detail) => acc + (detail.totalPrice ?? 0), 0)} €`]).alignment = {
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

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `DEVIS_${business.numBusiness}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className={styles.actions_container}>
      {!user.userInfo.roles.includes('ROLE_CLIENT') && (
        <>
          <Link from={routeApi.id} search={(prev) => ({ ...prev, hideTotal: !hideTotal })} className="btn btn-primary-light" replace resetScroll={false}>
            {hideTotal ? 'Afficher' : 'Masquer'} total
          </Link>
          <Link
            from={routeApi.id}
            search={(prev) => ({ ...prev, hideReferences: !hideReferences })}
            className="btn btn-primary-light"
            replace
            resetScroll={false}
          >
            {hideReferences ? 'Afficher' : 'Masquer'} les références
          </Link>
          <Link from={routeApi.id} search={(prev) => ({ ...prev, hidePrices: !hidePrices })} className="btn btn-primary-light" replace resetScroll={false}>
            {hidePrices ? 'Afficher' : 'Masquer'} les prix
          </Link>
          <Link
            from={routeApi.id}
            search={(prev) => ({ ...prev, hideAddresses: !hideAddresses })}
            className="btn btn-primary-light"
            replace
            resetScroll={false}
          >
            {hideAddresses ? 'Afficher' : 'Masquer'} {"l'adresse"}
          </Link>
        </>
      )}
      <Link from={routeApi.id} to="pdf" search={(old) => old} replace className="btn btn-primary">
        Editer
      </Link>
      <button onClick={onExport} className="btn btn-primary">
        Exporter
      </button>
    </div>
  );
}
