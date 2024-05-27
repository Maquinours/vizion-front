import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import FontDinRegular from '../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import Logo from '../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import BusinessResponseDto from '../../../../../../../../utils/types/BusinessResponseDto';
import BusinessBillResponseDto from '../../../../../../../../utils/types/BusinessBillResponseDto';
import { formatDateWithSlash } from '../../../../../../../../utils/functions/dates';

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
    paddingBottom: 70,
  },
  sectionOne: {
    margin: 10,
    padding: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionOneGridTwo: {
    minWidth: '200px',
  },
  logo: {
    height: 65,
    width: 200,
    marginBottom: 20,
  },
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
    justifyContent: 'space-between',
    width: '100%',
  },
  enterprise: {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
    minHeight: '120px',
    flexWrap: 'wrap',
  },
  enterpriseTitle: {
    lineHeight: 1.2,
    fontSize: 15,
    color: '#16204E',
    fontWeight: 'bold',
    marginBottom: 5,
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
  billHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  billHeaderText: {
    width: '30%',
    color: '#16204E',
    fontWeight: 'bold',
  },
  billHeaderLine: {
    width: '70%',
    borderTop: '1px solid #16204E',
  },
  billDetail: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'Din',
  },
  billDetailOne: {
    width: '100%',
    borderRight: '1px solid #16204E',
    paddingLeft: 10,
  },
  billDetailOneContainer: {
    marginBottom: 10,
  },
  billDetailOneTitle: {
    color: '#31385A',
    fontSize: 13,
    fontWeight: 'bold',
  },
  billDetailOneContent: {
    color: '#F24C52',
    fontSize: 10,
  },
  billDetailTwoContent: {
    color: '#F24C52',
    fontSize: 10,
    fontWeight: 'bold',
  },
  billDetailFour: {
    width: '100%',
    paddingLeft: 10,
  },
  tableContainer: {
    margin: 5,
    fontFamily: 'Din',
    position: 'relative',
  },
  tableHeaderContainer: {
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
  tableHeaderQuantity: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    borderRight: '1px solid white',
  },
  tableHeaderReference: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderDesignation: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '50%',
    borderRight: '1px solid white',
  },
  tableHeaderPackage: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderComment: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    flex: '100px 1 1',
    borderRight: '1px solid white',
  },
  tableBodyContainer: {
    width: '100%',
    height: 'auto',
  },
  tableBody: {
    display: 'flex',
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    gap: 0,
    borderBottom: '1px solid #16204E',
  },
  tableBodyQuantity: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '10%',
    borderRight: '1px solid #16204E',
  },
  tableBodyReference: {
    padding: 5,
    color: '#16204E',
    fontWeight: 'bold',
    fontSize: 10,
    width: '15%',
    borderRight: '1px solid #16204E',
  },
  tableBodyDesignation: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '50%',
    borderRight: '1px solid #16204E',
  },
  tableBodyEcoTax: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '15%',
    borderRight: '1px solid #16204E',
    display: 'flex',
    flexDirection: 'column',
  },
  tableBodyEcoTaxValue: {
    fontSize: 8,
  },
  tableBodyComment: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '10%',
  },
  recapContainer: {
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
  recapTableContentText: {
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
  recapTableTotal: {
    display: 'flex',
    flexDirection: 'row',
    color: '#F24C52',
  },
  recapTableTotalText: {
    width: '70%',
    padding: 5,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  recapTableTotalValue: {
    width: '30%',
    padding: 5,
    fontSize: 10,
    textAlign: 'right',
  },
  pageTextOne: {
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
  pageTextTwo: {
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

const amountFormatter = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

type AppViewBusinessViewBillViewPdfComponentProps = Readonly<{
  business: BusinessResponseDto;
  bill: BusinessBillResponseDto;
}>;
export default function AppViewBusinessViewBillViewPdfComponent({ business, bill }: AppViewBusinessViewBillViewPdfComponentProps) {
  const ecoTax = bill.billDetails.reduce((acc, item) => acc + (item.taxDEEE ?? 0), 0);

  return (
    <Document title={bill.number} author="VIZEO" creator="VIZEO" producer="VIZEO" keywords="facture,invoice,bill">
      <Page size="A4" style={pageStyles.page}>
        <View>
          <Image src={Logo} style={pageStyles.logo} />
          <View style={pageStyles.sectionOne}>
            <View>
              <Text style={pageStyles.addressOne}>13,rue Emile Decorps</Text>
              <Text style={pageStyles.addressTwo}>69100 Villeurbanne</Text>

              <Text style={pageStyles.email}>contact@vizeo.eu</Text>
              <Text style={pageStyles.phone}>04 72 12 27 96</Text>
              <Text style={pageStyles.website}>https://www.vizeo.eu</Text>
              <Text style={pageStyles.rc}>N°RC: 44494781600062</Text>
            </View>
            <View style={pageStyles.sectionOneGridTwo}>
              <View style={pageStyles.enterprise}>
                <Text style={pageStyles.enterpriseName}>{business.billingCompany}</Text>
                <Text style={pageStyles.enterpriseAddress}>{business.billingAddressOne}</Text>
                <Text style={pageStyles.enterpriseAddress}>
                  {business.billingZipCode} {business.billingCity}
                </Text>
              </View>
            </View>
          </View>

          {business.deliverAddressCompany && (
            <View style={pageStyles.sectionTwo}>
              <View style={pageStyles.enterprise}>
                <>
                  <Text style={pageStyles.enterpriseTitle}>Adresse de livraison</Text>
                  <Text style={pageStyles.enterpriseName}>{business.deliverAddressCompany}</Text>
                  <Text style={pageStyles.enterpriseContact}>{business.deliverAddressName}</Text>
                  <Text style={pageStyles.enterpriseAddress}>{business.deliverAddressOne}</Text>
                  <Text style={pageStyles.enterpriseAddress}>{business.deliverAddressTwo}</Text>
                  <Text style={pageStyles.enterpriseAddress}>
                    {business.deliverAddressZipCode} {business.deliverAddressCity}
                  </Text>
                </>
              </View>
            </View>
          )}
          <View>
            <View style={pageStyles.billHeader}>
              <Text style={pageStyles.billHeaderText}>Facture</Text>
              <Text style={pageStyles.billHeaderLine}></Text>
            </View>
            <View style={pageStyles.billDetail}>
              <View style={pageStyles.billDetailOne}>
                <View style={pageStyles.billDetailOneContainer}>
                  <Text style={pageStyles.billDetailOneTitle}>N° Facture</Text>
                  <Text style={pageStyles.billDetailOneContent}>{bill.number}</Text>
                </View>
              </View>
              <View style={pageStyles.billDetailOne}>
                <View style={pageStyles.billDetailOneContainer}>
                  <Text style={pageStyles.billDetailOneTitle}>N° Commande</Text>
                  <Text style={pageStyles.billDetailTwoContent}>{bill.numOrder}</Text>
                </View>
              </View>
              <View style={pageStyles.billDetailOne}>
                <View style={pageStyles.billDetailOneContainer}>
                  <Text style={pageStyles.billDetailOneTitle}>Dossier</Text>
                  <Text style={pageStyles.billDetailOneContent}>{business.numBusiness}</Text>
                </View>
              </View>
              <View style={pageStyles.billDetailFour}>
                <View style={pageStyles.billDetailOneContainer}>
                  <Text style={pageStyles.billDetailOneTitle}>Date de la facture</Text>
                  <Text style={pageStyles.billDetailOneContent}>{formatDateWithSlash(bill.createdDate)}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={pageStyles.tableContainer}>
            <View style={pageStyles.tableHeaderContainer}>
              <Text style={pageStyles.tableHeaderQuantity}>Qté</Text>
              <Text style={pageStyles.tableHeaderReference}>Référence</Text>
              <Text style={pageStyles.tableHeaderDesignation}>Désignation</Text>
              <Text style={pageStyles.tableHeaderPackage}>Pu HT</Text>
              <Text style={pageStyles.tableHeaderComment}>Total</Text>
            </View>
            <View style={pageStyles.tableBodyContainer}>
              {bill.billDetails.map((item) => (
                <View key={item.id} style={pageStyles.tableBody}>
                  <Text style={pageStyles.tableBodyQuantity}>{item.quantity}</Text>
                  <Text style={pageStyles.tableBodyReference}>{item.productReference}</Text>
                  <Text style={pageStyles.tableBodyDesignation}>{item.productDesignation}</Text>
                  <View style={pageStyles.tableBodyEcoTax}>
                    <Text>{amountFormatter(item.unitPrice ?? 0)}</Text>
                    {(item.taxDEEE ?? 0) > 0 && <Text style={pageStyles.tableBodyEcoTaxValue}>EcoTaxe : {amountFormatter(item.taxDEEE!)}</Text>}
                  </View>
                  <Text style={pageStyles.tableBodyComment}>{amountFormatter(item.totalPrice ?? 0)}</Text>
                </View>
              ))}
            </View>
            <View wrap={false} style={pageStyles.recapContainer}>
              <View style={pageStyles.recapTable}>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentText}>Total general HT :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(bill.totalAmountHT ?? 0)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentText}>Frais de port :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(bill.shippingServicePrice)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentText}>Total EcoTaxe :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(ecoTax)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentText}>Total TVA (Taux de TVA 20.0%) :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(bill.vat)}</Text>
                </View>
                <View style={pageStyles.recapTableTotal}>
                  <Text style={pageStyles.recapTableTotalText}>Total TTC :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(bill.totalAmount ?? 0)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Text fixed style={pageStyles.pageTextOne}>
          La T.V.A sur les prestations {"n'est"} déductible que sur le montant effectivement payé. Conformément à {"l'article"} L. 441-6 du code decommerce, des
          pénalités de retard sont due à defaut de réglement le jour suivant la date de paiement qui figure sur la facture. Le taux {"d'intérêt"} de ces
          pénalités de retard est de 25% annuels. Aucun escompte consenti pour paiement anticipé.
        </Text>
        <Text style={pageStyles.pageTextTwo} fixed>
          SAS VIZEO au capital de 200 000€ - N° TVA : FR76 444 947 816 - Code NAF : 4669A
        </Text>
        <Text style={pageStyles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
