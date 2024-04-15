import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import Logo from '../../../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import FontDinRegular from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import BusinessResponseDto from '../../../../../../../../../../utils/types/BusinessResponseDto';
import EnterpriseResponseDto from '../../../../../../../../../../utils/types/EnterpriseResponseDto';
import BusinessBillResponseDto from '../../../../../../../../../../utils/types/BusinessBillResponseDto';
import { formatDateWithSlash } from '../../../../../../../../../../utils/functions/dates';
import { BusinessCreditDetails, BusinessCreditRow } from '../../../../Credit';

Font.register({
  family: 'Din',
  fonts: [
    {
      src: FontDinRegular,
    },
    {
      src: FontDinBold,
      fontWeight: 'bold',
    },
  ],
});

const pageStyles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    padding: 20,
    fontFamily: 'Din',
  },

  sectionOne: { margin: 10, padding: 10, fontFamily: 'Din' },
  logo: { height: 65, width: 200, marginBottom: 20 },
  addressOne: {
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
    fontFamily: 'Din',
  },
  addressTwo: {
    fontSize: 13,
    lineHeight: 1.2,
    color: '#16204E',
    marginBottom: 7,
  },
  email: {
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
  },
  phone: {
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
  },
  website: {
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
  },
  rc: {
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
  },

  sectionTwo: {
    margin: 10,
    padding: 10,
    position: 'relative',
    top: '-20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  enterprise: {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
    flexWrap: 'wrap',
    minHeight: 110,
  },

  enterpriseName: {
    textTransform: 'uppercase',
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
    marginBottom: 5,
  },
  enterpriseContact: {
    textTransform: 'uppercase',
    lineHeight: 2,
    fontSize: 13,
    color: '#16204E',
  },
  enterpriseAddress: {
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
  },

  arcHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arcHeaderText: {
    width: '30%',
    color: '#16204E',
    fontWeight: 'bold',
  },
  arcHeaderLine: {
    width: '70%',
    borderTop: '1px solid #16204E',
  },

  arcDetail: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'Din',
  },
  arcDetailOne: {
    width: '100%',
    borderRight: '1px solid #16204E',
    paddingLeft: 10,
    marginBottom: 10,
  },

  arcDetailTitle: {
    color: '#31385A',
    fontSize: 13,
    fontWeight: 'bold',
  },
  arcDetailContent: {
    color: '#F24C52',
    fontSize: 10,
  },
  arcDetailContentTwo: {
    color: '#F24C52',
    fontSize: 10,
    fontWeight: 'bold',
  },
  arcDetailTwo: {
    width: '100%',
    paddingLeft: 10,
    marginBottom: 10,
  },

  tableContainer: {
    margin: 5,
    fontFamily: 'Din',
    position: 'relative',
  },
  tableHeader: {
    backgroundColor: '#16204E',
    display: 'flex',
    width: '100%',
    height: 'auto',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
    fontFamily: 'Din',
    fontWeight: 'bold',
  },

  tableHeaderQtyCell: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    borderRight: '1px solid white',
  },
  tableHeaderRefCell: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderDesignationCell: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '50%',
    borderRight: '1px solid white',
  },
  tableHeaderUnitPriceCell: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderTotalCell: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    flex: '100px 1 1',
    borderRight: '1px solid white',
  },

  tableBody: {
    width: '100%',
    height: 'auto',
  },

  tableBodyRow: {
    display: 'flex',
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    gap: 0,
    // borderTop: "1px solid #16204E",
    borderBottom: '1px solid #16204E',
  },

  tableBodyCell: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontWeight: 'bold',
    fontSize: 10,
    width: '15%',
    borderRight: '1px solid #16204E',
  },

  tableBodyQtyCell: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '10%',
    borderRight: '1px solid #16204E',
  },

  tableBodyRefCell: {
    padding: 5,
    color: '#16204E',
    fontWeight: 'bold',
    fontSize: 10,
    width: '15%',
    borderRight: '1px solid #16204E',
  },
  tableBodyDesignationCell: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '50%',
    borderRight: '1px solid #16204E',
  },

  tableBodyUnitPriceCell: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '15%',
    borderRight: '1px solid #16204E',
    display: 'flex',
    flexDirection: 'column',
  },

  tableBodyTotalCell: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '10%',
  },

  tableBodyCellValue: {
    fontSize: 8,
  },

  recap: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontFamily: 'Din',
  },

  recapTable: {
    width: '250px',
  },

  recapTableContent: {
    display: 'flex',
    flexDirection: 'row',
    color: '#16204E',
  },
  recapTableContentLabel: {
    width: '70%',
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  recapTableContentValue: {
    width: '30%',
    padding: 5,
    fontSize: 10,
    textAlign: 'right',
  },

  recapTotal: {
    display: 'flex',
    flexDirection: 'row',
    color: '#F24C52',
  },
  recapTotalLabel: {
    width: '70%',
    padding: 5,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  recapTotalValue: {
    width: '30%',
    padding: 5,
    fontSize: 10,
    textAlign: 'right',
  },

  footerTextOne: {
    fontSize: 8,
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 25,
    textAlign: 'left',
    width: '80%',
    marginTop: 15,
    color: '#16204E',
  },
  footerTextTwo: {
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 10,
    fontSize: 8,
    textAlign: 'left',
    width: '80%',
    color: '#16204E',
    fontWeight: 'bold',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 10,
    left: 0,
    right: 20,
    textAlign: 'right',
    color: '#16204E',
  },
});

const amountFormatter = (number: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(number.toFixed(2)));
};

type AppViewToolsViewCreditsViewShowModalViewPdfComponentProps = Readonly<{
  business: BusinessResponseDto | undefined;
  enterprise: EnterpriseResponseDto | undefined;
  bill: BusinessBillResponseDto | undefined;
  totalAmountHT: number;
  shippingServicePrice: number;
  ecoTax: number;
  vat: number;
  totalAmount: number;
  details: BusinessCreditDetails | undefined;
  items: Array<BusinessCreditRow>;
}>;
export default function AppViewToolsViewCreditsViewShowModalViewPdfComponent({
  business,
  enterprise,
  bill,
  totalAmountHT,
  shippingServicePrice,
  ecoTax,
  vat,
  totalAmount,
  details,
  items,
}: AppViewToolsViewCreditsViewShowModalViewPdfComponentProps) {
  return (
    <Document title="Avoir" author="VIZEO" creator="VIZEO" producer="VIZEO" keywords="avoir,credit">
      <Page size="A4" style={pageStyles.page}>
        <View>
          <View style={pageStyles.sectionOne}>
            <Image src={Logo} style={pageStyles.logo} />
            <Text style={pageStyles.addressOne}>13,rue Emile Decorps</Text>
            <Text style={pageStyles.addressTwo}>69100 Villeurbanne</Text>

            <Text style={pageStyles.email}>contact@vizeo.eu</Text>
            <Text style={pageStyles.phone}>04 72 12 27 96</Text>
            <Text style={pageStyles.website}>https://www.vizeo.eu</Text>
            <Text style={pageStyles.rc}>N°RC: 44494781600062</Text>
          </View>
          <View style={pageStyles.sectionTwo}>
            <View style={pageStyles.enterprise}>
              <Text style={pageStyles.enterpriseName}>{business?.billingCompany}</Text>
              <Text style={pageStyles.enterpriseContact}>{enterprise?.accountability?.billingServiceName ?? ''}</Text>
              <Text style={pageStyles.enterpriseAddress}>{business?.billingAddressOne}</Text>
              <Text style={pageStyles.enterpriseAddress}>{business?.billingAddressTwo}</Text>
              <Text style={pageStyles.enterpriseAddress}>
                {business?.billingZipCode} {business?.billingCity}
              </Text>
            </View>
          </View>
          <View>
            <View style={pageStyles.arcHeader}>
              <Text style={pageStyles.arcHeaderText}>Avoir</Text>
              <Text style={pageStyles.arcHeaderLine}></Text>
            </View>
            <View style={pageStyles.arcDetail}>
              <View style={pageStyles.arcDetailOne}>
                <Text style={pageStyles.arcDetailTitle}>N° Facture</Text>
                <Text style={pageStyles.arcDetailContent}>{bill?.number}</Text>
              </View>
              <View style={pageStyles.arcDetailOne}>
                <Text style={pageStyles.arcDetailTitle}>N° Commande</Text>
                <Text style={pageStyles.arcDetailContent}>{bill?.numOrder}</Text>
              </View>
              <View style={pageStyles.arcDetailOne}>
                <Text style={pageStyles.arcDetailTitle}>Dossier</Text>
                <Text style={pageStyles.arcDetailContentTwo}>{business?.numBusiness ?? details?.billNumBusiness}</Text>
              </View>
              <View style={pageStyles.arcDetailTwo}>
                <Text style={pageStyles.arcDetailTitle}>{"Date de l'avoir"}</Text>
                <Text style={pageStyles.arcDetailContent}>{formatDateWithSlash(new Date())}</Text>
              </View>
            </View>
          </View>
          <View style={pageStyles.tableContainer}>
            <View style={pageStyles.tableHeader}>
              <Text style={pageStyles.tableHeaderQtyCell}>Qté</Text>
              <Text style={pageStyles.tableHeaderRefCell}>Référence</Text>
              <Text style={pageStyles.tableHeaderDesignationCell}>Désignation</Text>
              <Text style={pageStyles.tableHeaderUnitPriceCell}>Pu HT</Text>
              <Text style={pageStyles.tableHeaderTotalCell}>Total</Text>
            </View>
            <View style={pageStyles.tableBody}>
              {items.map((item) => (
                <View key={item.detail.id} style={pageStyles.tableBodyRow}>
                  <Text style={pageStyles.tableBodyQtyCell}>{item.quantity}</Text>
                  <Text style={pageStyles.tableBodyRefCell}>{item.detail.productReference}</Text>
                  <Text style={pageStyles.tableBodyDesignationCell}>{item.detail.productDesignation}</Text>
                  <View style={pageStyles.tableBodyUnitPriceCell}>
                    <Text>{amountFormatter(item.price)}</Text>
                    {(item.detail.taxDEEE ?? 0) > 0 && <Text style={pageStyles.tableBodyCellValue}>EcoTaxe : {amountFormatter(item.detail.taxDEEE!)}</Text>}
                  </View>
                  <Text style={pageStyles.tableBodyTotalCell}>{amountFormatter(item.price * item.quantity)}</Text>
                </View>
              ))}
            </View>
            <View wrap={false} style={pageStyles.recap}>
              <View style={pageStyles.recapTable}>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentLabel}>Total général HT :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(totalAmountHT)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentLabel}>Frais de port :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(shippingServicePrice)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentLabel}>Total EcoTaxe :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(ecoTax)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentLabel}>Total TVA (Taux de TVA 20.0%) :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(vat)}</Text>
                </View>
                <View style={pageStyles.recapTotal}>
                  <Text style={pageStyles.recapTotalLabel}>Total TTC :</Text>
                  <Text style={pageStyles.recapTotalValue}>{amountFormatter(totalAmount)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Text fixed style={pageStyles.footerTextOne}>
          La T.V.A sur les prestations {"n'est"} déductible que sur le montant effectivement payé. Conformément à {"l'article"} L. 441-6 du code decommerce, des
          pénalités de retard sont due à defaut de réglement le jour suivant la date de paiement qui figure sur la facture. Le taux {"d'intérêt"} de ces
          pénalités de retard est de 25% annuels. Aucun escompte consenti pour paiement anticipé.
        </Text>
        <Text style={pageStyles.footerTextTwo} fixed>
          SAS VIZEO au capital de 200 000€ - N° TVA : FR76 444 947 816 - Code NAF : 4669A
        </Text>
        <Text style={pageStyles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
