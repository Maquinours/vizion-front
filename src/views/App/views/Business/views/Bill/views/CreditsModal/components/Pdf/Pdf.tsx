import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import FontDinRegular from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import Logo from '../../../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import BusinessResponseDto from '../../../../../../../../../../utils/types/BusinessResponseDto';
import EnterpriseResponseDto from '../../../../../../../../../../utils/types/EnterpriseResponseDto';
import BusinessBillResponseDto from '../../../../../../../../../../utils/types/BusinessBillResponseDto';
import { formatDateWithSlash } from '../../../../../../../../../../utils/functions/dates';

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
    padding: 5,
    fontFamily: 'Din',
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
    padding: 5,
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
    minHeight: 150,
    flexWrap: 'wrap',
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
  creditHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditHeaderText: {
    width: '30%',
    color: '#16204E',
    fontWeight: 'bold',
  },
  creditHeaderLine: {
    width: '70%',
    borderTop: '1px solid #16204E',
  },
  creditDetail: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'Din',
  },
  creditDetailOne: {
    width: '100%',
    borderRight: '1px solid #16204E',
    paddingLeft: 10,
  },
  creditDetailOneContainer: {
    marginBottom: 10,
  },
  creditDetailOneTitle: {
    color: '#31385A',
    fontSize: 13,
    fontWeight: 'bold',
  },
  creditDetailOneContent: {
    color: '#F24C52',
    fontSize: 10,
  },
  creditDetailTwoContent: {
    color: '#16204E',
    fontSize: 10,
  },
  creditDetailThreeContent: {
    color: '#F24C52',
    fontSize: 10,
    fontWeight: 'bold',
  },
  creditDetailFour: {
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
    minHeight: 30,
    color: '#16204E',
    fontSize: 10,
    width: '10%',
    borderRight: '1px solid #16204E',
  },
  tableBodyReference: {
    padding: 5,
    minHeight: 30,
    color: '#16204E',
    fontWeight: 'bold',
    fontSize: 10,
    width: '15%',
    borderRight: '1px solid #16204E',
  },
  tableBodyDesignation: {
    padding: 5,
    minHeight: 30,
    color: '#16204E',
    fontSize: 10,
    width: '50%',
    borderRight: '1px solid #16204E',
  },
  tableBodyEcoTax: {
    padding: 5,
    minHeight: 30,
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
    minHeight: 30,
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

const amountFormatter = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);

type AppViewBusinessViewBillViewCreditsModalViewPdfComponentProps = Readonly<{
  business: BusinessResponseDto;
  enterprise: EnterpriseResponseDto | null;
  credit: BusinessBillResponseDto;
}>;
export default function AppViewBusinessViewBillViewCreditsModalViewPdfComponent({
  business,
  enterprise,
  credit,
}: AppViewBusinessViewBillViewCreditsModalViewPdfComponentProps) {
  const ecoTax = credit.billDetails.reduce((acc, item) => acc + (item.taxDEEE ?? 0), 0);

  return (
    <Document title={'Avoir'} author="VIZEO" creator="VIZEO" producer="VIZEO" keywords="avoir,credit">
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
            <Text style={pageStyles.rc}>N°TVA: FR76444947816</Text>
          </View>
          <View style={pageStyles.sectionTwo}>
            <View style={pageStyles.enterprise}>
              <Text style={pageStyles.enterpriseName}>{business.billingCompany}</Text>
              <Text style={pageStyles.enterpriseContact}>{enterprise?.accountability?.billingServiceName ?? ''}</Text>
              <Text style={pageStyles.enterpriseAddress}>{business.billingAddressOne}</Text>
              <Text style={pageStyles.enterpriseAddress}>
                {business.billingZipCode} {business.billingCity}
              </Text>
            </View>
          </View>
          <View>
            <View style={pageStyles.creditHeader}>
              <Text style={pageStyles.creditHeaderText}>Avoir</Text>
              <Text style={pageStyles.creditHeaderLine}></Text>
            </View>

            <View style={pageStyles.creditDetail}>
              <View style={pageStyles.creditDetailOne}>
                <View style={pageStyles.creditDetailOneContainer}>
                  <Text style={pageStyles.creditDetailOneTitle}>N° Avoir</Text>
                  <Text style={pageStyles.creditDetailOneContent}>{credit.number}</Text>
                </View>
              </View>
              <View style={pageStyles.creditDetailOne}>
                <View style={pageStyles.creditDetailOneContainer}>
                  <Text style={pageStyles.creditDetailOneTitle}>N° Commande</Text>
                  <Text style={pageStyles.creditDetailTwoContent}>{credit.numOrder}</Text>
                </View>
              </View>
              <View style={pageStyles.creditDetailOne}>
                <View style={pageStyles.creditDetailOneContainer}>
                  <Text style={pageStyles.creditDetailOneTitle}>Dossier</Text>
                  <Text style={pageStyles.creditDetailThreeContent}>{credit.numBusiness}</Text>
                </View>
              </View>
              <View style={pageStyles.creditDetailFour}>
                <View style={pageStyles.creditDetailOneContainer}>
                  <Text style={pageStyles.creditDetailOneTitle}>{"Date de l'avoir"}</Text>
                  <Text style={pageStyles.creditDetailTwoContent}>{formatDateWithSlash(credit.createdDate)}</Text>
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
              {credit.billDetails.map((item) => (
                <View key={item.id} style={pageStyles.tableBody}>
                  <Text style={pageStyles.tableBodyQuantity}>{item.quantity}</Text>
                  <Text style={pageStyles.tableBodyReference}>{item.productReference}</Text>
                  <Text style={pageStyles.tableBodyDesignation}>{item.productDesignation}</Text>
                  <View style={pageStyles.tableBodyEcoTax}>
                    <Text>{amountFormatter(item.unitPrice ?? 0)}</Text>
                    {(item.taxDEEE ?? 0) > 0 && <Text style={pageStyles.tableBodyEcoTaxValue}>EcoTaxe : {amountFormatter(item.taxDEEE ?? 0)}</Text>}
                  </View>
                  <Text style={pageStyles.tableBodyComment}>{amountFormatter(item.totalPrice ?? 0)}</Text>
                </View>
              ))}
            </View>
            <View wrap={false} style={pageStyles.recapContainer}>
              <View style={pageStyles.recapTable}>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentText}>Total général HT :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(credit.totalAmountHT ?? 0)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentText}>Frais de port :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(credit.shippingServicePrice)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentText}>Total EcoTaxe :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(ecoTax)}</Text>
                </View>
                <View style={pageStyles.recapTableContent}>
                  <Text style={pageStyles.recapTableContentText}>Total TVA (Taux de TVA 20.0%) :</Text>
                  <Text style={pageStyles.recapTableContentValue}>{amountFormatter(credit.vat)}</Text>
                </View>
                <View style={pageStyles.recapTableTotal}>
                  <Text style={pageStyles.recapTableTotalText}>Total TTC :</Text>
                  <Text style={pageStyles.recapTableTotalValue}>{amountFormatter(credit.totalAmount ?? 0)}</Text>
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
