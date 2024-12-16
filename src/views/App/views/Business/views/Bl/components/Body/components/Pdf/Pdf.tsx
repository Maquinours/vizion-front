import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import Logo from '../../../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import FontDinRegular from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import BusinessResponseDto from '../../../../../../../../../../utils/types/BusinessResponseDto';
import BusinessBlResponseDto from '../../../../../../../../../../utils/types/BusinessBlResponseDto';
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
    flexWrap: 'nowrap',
    minHeight: '100px',
  },
  enterpriseName: {
    textTransform: 'uppercase',
    fontSize: 13,
    color: '#16204E',
    marginBottom: 5,
  },
  enterpriseContact: {
    textTransform: 'uppercase',
    fontSize: 13,
    color: '#16204E',
    marginBottom: 5,
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
  },
  arcDetailContainer: {
    marginBottom: 10,
  },
  arcDetailContainerTitle: {
    color: '#31385A',
    fontSize: 13,
    fontWeight: 'bold',
  },
  arcDetailContainerContent: {
    color: '#16204E',
    fontSize: 10,
  },
  arcDetailThreeContainerContent: {
    color: '#F24C52',
    fontSize: 10,
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
  tableHeaderContainerQty: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    borderRight: '1px solid white',
  },
  tableHeaderContainerReference: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderContainerDescription: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '40%',
    borderRight: '1px solid white',
  },
  tableHeaderContainerPackage: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    borderRight: '1px solid white',
  },
  tableHeaderContainerComment: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '25%',
    borderRight: '1px solid white',
  },
  tableBodyContainer: {
    width: '100%',
    height: 'auto',
  },
  tableBodyContainerBody: {
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
    fontSize: 10,
    width: '15%',
    borderRight: '1px solid #16204E',
  },
  tableBodyDescription: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '40%',
    borderRight: '1px solid #16204E',
  },
  tableBodyPackage: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '10%',
    borderRight: '1px solid #16204E',
  },
  tableBodyComment: {
    padding: 5,
    color: '#16204E',
    fontSize: 10,
    width: '25%',
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

const amountFormatter = (value: number) => {
  return value.toLocaleString('fr-FR').replaceAll('\u202f', ' ');
};

type AppViewBusinessViewBlViewBodyComponentPdfComponent = Readonly<{
  business: BusinessResponseDto;
  bl: BusinessBlResponseDto;
}>;
export default function AppViewBusinessViewBlViewBodyComponentPdfComponent({ business, bl }: AppViewBusinessViewBlViewBodyComponentPdfComponent) {
  return (
    <Document title={bl.number} author="VIZEO" creator="VIZEO" producer="VIZEO" keywords="bon de livraison">
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
              <Text style={pageStyles.enterpriseName}>{business.deliverAddressCompany ?? business.billingAddressOne}</Text>
              <Text style={pageStyles.enterpriseContact}>{business.deliverAddressName ?? business.billingName}</Text>
              <Text style={pageStyles.enterpriseAddress}>{business.deliverAddressOne ?? business.billingAddressOne}</Text>
              <Text style={pageStyles.enterpriseAddress}>{business.deliverAddressTwo ?? business.billingAddressTwo}</Text>
              <Text style={pageStyles.enterpriseAddress}>
                {business.deliverAddressZipCode ?? business.billingZipCode} {business.deliverAddressCity ?? business.billingCity}
              </Text>
            </View>
          </View>
          <View>
            <View style={pageStyles.arcHeader}>
              <Text style={pageStyles.arcHeaderText}>Bon de Livraison</Text>
              <Text style={pageStyles.arcHeaderLine}></Text>
            </View>
            <View style={pageStyles.arcDetail}>
              <View style={pageStyles.arcDetailOne}>
                <View style={pageStyles.arcDetailContainer}>
                  <Text style={pageStyles.arcDetailContainerTitle}>N° Commande</Text>
                  <Text style={pageStyles.arcDetailContainerContent}>{business.numOrder}</Text>
                </View>
              </View>
              <View style={pageStyles.arcDetailOne}>
                <View style={pageStyles.arcDetailContainer}>
                  <Text style={pageStyles.arcDetailContainerTitle}>N° du BL</Text>
                  <Text style={pageStyles.arcDetailContainerTitle}>{bl.number}</Text>
                </View>
              </View>
              <View style={pageStyles.arcDetailOne}>
                <View style={pageStyles.arcDetailContainer}>
                  <Text style={pageStyles.arcDetailContainerTitle}>Livraison</Text>
                  <Text style={pageStyles.arcDetailContainerContent}>{bl.deliverMode}</Text>
                </View>
              </View>
              <View style={pageStyles.arcDetailFour}>
                <View style={pageStyles.arcDetailContainer}>
                  <Text style={pageStyles.arcDetailContainerTitle}>Date de création</Text>
                  <Text style={pageStyles.arcDetailContainerContent}>{formatDateWithSlash(bl.createdDate)}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={pageStyles.tableContainer}>
            <View style={pageStyles.tableHeaderContainer}>
              <Text style={pageStyles.tableHeaderContainerQty}>Qté</Text>
              <Text style={pageStyles.tableHeaderContainerReference}>Référence</Text>
              <Text style={pageStyles.tableHeaderContainerDescription}>Désignation</Text>
              <Text style={pageStyles.tableHeaderContainerPackage}>Colis</Text>
              <Text style={pageStyles.tableHeaderContainerComment}>Commentaire</Text>
            </View>
            <View style={pageStyles.tableBodyContainer}>
              {bl.blDetailsList.map((item) => (
                <View key={item.id} style={pageStyles.tableBodyContainerBody}>
                  <Text style={pageStyles.tableBodyQuantity}>{amountFormatter(item.quantityDelivered ?? 0)}</Text>
                  <Text style={pageStyles.tableBodyReference}>{item.productReference}</Text>
                  <Text style={pageStyles.tableBodyDescription}>{item.productDesignation}</Text>
                  <Text style={pageStyles.tableBodyPackage}>{item.packageNumber}</Text>
                  <Text style={pageStyles.tableBodyComment}>{item.comment}</Text>
                </View>
              ))}
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
