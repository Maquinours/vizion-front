import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import FontDinBold from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import FontDinRegular from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import Logo from '../../../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import { formatDateWithSlash } from '../../../../../../../../../../utils/functions/dates';
import BusinessArcResponseDto from '../../../../../../../../../../utils/types/BusinessArcResponseDto';
import BusinessResponseDto from '../../../../../../../../../../utils/types/BusinessResponseDto';

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
    padding: 10,
    fontFamily: 'Din',
    position: 'relative',
    paddingBottom: 70,
  },
  body: {
    position: 'relative',
  },
  sectionOne: {
    margin: 10,
    padding: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  sectionOneGridTwo: {
    minWidth: '200px',
  },
  enterprise: {
    display: 'flex',
    flexDirection: 'column',
    width: 200,
    minHeight: '120px',
    flexWrap: 'wrap',
  },
  enterpriseName: {
    textTransform: 'uppercase',
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
    marginBottom: 5,
  },
  enterpriseAddress: {
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
  },
  enterpriseTitle: {
    lineHeight: 1.2,
    fontSize: 15,
    color: '#16204E',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  enterpriseContact: {
    textTransform: 'uppercase',
    lineHeight: 2,
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
  arcHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arcHeaderText: {
    width: '20%',
    color: '#16204E',
  },
  arcHeaderLine: {
    width: '80%',
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
  arcDetailChild: {
    width: '100%',
    borderRight: '1px solid #16204E',
    paddingLeft: 10,
  },
  arcDetailContainer: {
    marginBottom: 10,
  },
  arcDetailTitle: {
    color: '#31385A',
    fontSize: 13,
    fontWeight: 'bold',
  },
  arcDetailContent: {
    color: '#16204E',
    fontSize: 12,
  },
  arcDetailThreeContent: {
    color: '#F24C52',
    fontSize: 12,
    fontWeight: 'bold',
  },
  arcDetailFour: {
    width: '100%',
    paddingLeft: 10,
  },
  tableContainer: {
    margin: 5,
    fontFamily: 'Din',
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
  tableHeaderQuantity: { padding: 5, color: 'white', fontSize: 13, width: '10%', borderRight: '1px solid white' },
  tableHeaderReference: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderDescription: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '35%',
    borderRight: '1px solid white',
  },
  tableHeaderPrice: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderTotal: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    flex: '100px 1 1',
    borderRight: '1px solid white',
  },
  tableHeaderDispo: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
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
    borderTop: '1px solid #16204E',
    borderBottom: '0.5px solid #16204E',
  },
  tableBodyQuantity: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '10%',
  },
  tableBodyReference: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '15%',
  },
  tableBodyDescription: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '35%',
  },
  tableBodyPrice: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '15%',
  },
  tableBodyTotal: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '15%',
  },
  tableBodyDispo: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '10%',
  },
  tableBodyDispoOk: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    color: 'green',
  },
  tableBodyDispoNotOk: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    color: '#F24C52',
  },
  recapContainer: {
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recapTable: {
    width: '300px',
  },
  recapTableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#16204E',
    color: 'white',
  },
  recapTableHeaderText: {
    width: '70%',
    padding: 5,
    fontSize: 13,
    borderRight: '1px solid white',
    fontWeight: 'bold',
  },
  recapTableHeaderValue: {
    width: '30%',
    padding: 5,
    fontSize: 13,
    fontWeight: 'bold',
  },
  recapTableBody: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #16204E',
  },
  recapTableBodyText: {
    width: '40%',
    padding: 5,
    fontSize: 13,
    color: '#16204E',
    borderRight: '1px solid #16204E',
    fontWeight: 'bold',
  },
  recapTableBodyValue: {
    width: '30%',
    padding: 5,
    fontSize: 13,
    color: '#16204E',
    borderRight: '1px solid #16204E',
  },
  recapTableFooter: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#16204E',
    color: 'white',
  },
  recapTableFooterText: {
    width: '70%',
    padding: 5,
    fontSize: 13,
    borderRight: '1px solid white',
    fontWeight: 'bold',
  },
  recapTableFooterValue: {
    width: '30%',
    padding: 5,
    fontSize: 13,
    fontWeight: 'bold',
  },
  delay: {
    marginTop: 40,
    fontSize: 10,
    color: '#16204E',
    textAlign: 'left',
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

type AppViewBusinessViewArcViewPdfModalViewPdfComponent = Readonly<{
  business: BusinessResponseDto;
  arc: BusinessArcResponseDto;
  hideReferencesPrices: boolean;
}>;
export default function AppViewBusinessViewArcViewPdfModalViewPdfComponent({
  business,
  arc,
  hideReferencesPrices,
}: AppViewBusinessViewArcViewPdfModalViewPdfComponent) {
  return (
    <Document title={arc.documentName + ' ' + arc.number} author="VIZEO" creator="VIZEO" producer="VIZEO" keywords="arc,ack,bon_de_commande">
      <Page size="A4" style={pageStyles.page}>
        <View style={pageStyles.body}>
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
                <Text style={pageStyles.enterpriseTitle}>Adresse de livraison</Text>
                <Text style={pageStyles.enterpriseName}>{business.deliverAddressCompany}</Text>
                <Text style={pageStyles.enterpriseContact}>{business.deliverAddressName}</Text>
                <Text style={pageStyles.enterpriseAddress}>{business.deliverAddressOne}</Text>
                <Text style={pageStyles.enterpriseAddress}>{business.deliverAddressTwo}</Text>
                <Text style={pageStyles.enterpriseAddress}>
                  {business.deliverAddressZipCode} {business.deliverAddressCity}
                </Text>
              </View>
            </View>
          )}

          <View>
            <View style={pageStyles.arcHeader}>
              <Text style={pageStyles.arcHeaderText}>{arc.documentName}</Text>
              <Text style={pageStyles.arcHeaderLine}></Text>
            </View>
            <View style={pageStyles.arcDetail}>
              <View style={pageStyles.arcDetailChild}>
                <View style={pageStyles.arcDetailContainer}>
                  <Text style={pageStyles.arcDetailTitle}>Affaire</Text>
                  <Text style={pageStyles.arcDetailContent}>{business.title}</Text>
                </View>
              </View>
              <View style={pageStyles.arcDetailChild}>
                <View style={pageStyles.arcDetailContainer}>
                  <Text style={pageStyles.arcDetailTitle}>N° ARC</Text>
                  <Text style={pageStyles.arcDetailContent}>{arc.number}</Text>
                </View>
              </View>
              <View style={pageStyles.arcDetailChild}>
                <View style={pageStyles.arcDetailContainer}>
                  <Text style={pageStyles.arcDetailTitle}>N° Commande</Text>
                  <Text style={pageStyles.arcDetailThreeContent}>{arc.numOrder}</Text>
                </View>
              </View>
              <View style={pageStyles.arcDetailFour}>
                <View style={pageStyles.arcDetailContainer}>
                  <Text style={pageStyles.arcDetailTitle}>Date de création</Text>
                  <Text style={pageStyles.arcDetailContent}>{formatDateWithSlash(arc.createdDate)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={pageStyles.tableContainer}>
            <View style={pageStyles.tableHeaderContainer}>
              <Text style={pageStyles.tableHeaderQuantity}>Qté</Text>
              <Text style={pageStyles.tableHeaderReference}>Référence</Text>
              <Text style={pageStyles.tableHeaderReference}>Désignation</Text>
              <Text style={pageStyles.tableHeaderPrice}>PU HT</Text>
              <Text style={pageStyles.tableHeaderTotal}>Total</Text>
              <Text style={pageStyles.tableHeaderDispo}>Dispo</Text>
            </View>

            <View style={pageStyles.tableBodyContainer}>
              {arc.arcDetailsList?.map((item) => (
                <View key={item.id} style={pageStyles.tableBody} wrap={false}>
                  <Text style={pageStyles.tableBodyQuantity}>{item.quantity}</Text>
                  <Text style={pageStyles.tableBodyReference}>{hideReferencesPrices ? '' : `${item.productReference}`}</Text>
                  <Text style={pageStyles.tableBodyDescription}>{item.productDesignation}</Text>
                  <Text style={pageStyles.tableBodyPrice}>{hideReferencesPrices ? '' : `${item.unitPrice} €`}</Text>
                  <Text style={pageStyles.tableBodyTotal}>{hideReferencesPrices ? '' : `${item.totalPrice} €`}</Text>
                  <Text style={pageStyles.tableBodyDispo}>
                    {item.stock ? (
                      <Text style={pageStyles.tableBodyDispoOk}>Oui</Text>
                    ) : (
                      <Text style={pageStyles.tableBodyDispoNotOk}>{item.availableDate ? formatDateWithSlash(new Date(item.availableDate)) : 'Non'}</Text>
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={pageStyles.recapContainer} wrap={false}>
            <View style={pageStyles.recapTable}>
              <View style={pageStyles.recapTableHeader}>
                <Text style={pageStyles.recapTableHeaderText}>TOTAL GÉNÉRAL HT</Text>
                <Text style={pageStyles.recapTableHeaderValue}>{arc.totalAmountHT} €</Text>
              </View>
              <View style={pageStyles.recapTableBody}>
                <Text style={pageStyles.recapTableBodyText}>Frais de port</Text>
                <Text style={pageStyles.recapTableBodyValue}>{arc.shippingServicePrice} €</Text>
                <Text style={pageStyles.recapTableBodyValue}>{arc.shippingServicePrice === 0 ? 'Offert' : `${arc.shippingServicePrice} €`}</Text>
              </View>
              <View style={pageStyles.recapTableBody}>
                <Text style={pageStyles.recapTableBodyText}>TVA</Text>
                <Text style={pageStyles.recapTableBodyValue}>20%</Text>
                <Text style={pageStyles.recapTableBodyValue}>{(((arc.totalAmountHT ?? 0) + arc.shippingServicePrice) * 0.2).toFixed(2)} €</Text>
              </View>
              <View style={pageStyles.recapTableFooter}>
                <Text style={pageStyles.recapTableFooterText}>Total TTC</Text>
                <Text style={pageStyles.recapTableFooterValue}>{(arc.totalAmount ?? 0).toFixed(2)} €</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={pageStyles.delay}>Si dispo : préparation et expédition pour 24/48h</Text>
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
