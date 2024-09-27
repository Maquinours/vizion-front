import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import FontDinBold from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import FontDinRegular from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import Logo from '../../../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import AssistanceResponseDto from '../../../../../../../../../../utils/types/AssistanceResponseDto';
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

// Create styles
const pageStyles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    padding: 10,
    fontFamily: 'Din',
  },
  container: {
    paddingBottom: 38,
  },
  sectionOne: {
    margin: 10,
    padding: 5,
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
    width: '200px',
    height: '100px',
    flexWrap: 'wrap',
    paddingRight: 10,
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
  quoteHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteHeaderText: {
    width: '75%',
    color: '#16204E',
    fontSize: '15',
  },
  quoteHeaderLine: {
    width: '25%',
    borderTop: '1px solid #16204E',
  },

  table: {
    marginTop: 10,
    marginBottom: 10,
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
    fontWeight: 'bold',
  },
  tableHeaderRef: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderNumber: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '20%',
    borderRight: '1px solid white',
  },
  tableHeaderWarranty: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    borderRight: '1px solid white',
  },
  tableHeaderProb: {
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
    borderRight: '1px solid white',
  },
  tableHeaderConstat: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    borderRight: '1px solid white',
  },
  tableHeaderSolution: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '20%',
  },
  tableBody: {
    width: '100%',
    height: 'auto',
  },
  tableBodyRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    height: 'auto',
    gap: 0,
    borderBottom: '1px solid #16204E',
  },
  tableBodyRef: {
    padding: 5,
    color: '#16204E',
    fontSize: 12,
    width: '15%',
    borderRight: '1px solid #16204E',
  },
  tableBodyNumber: {
    padding: 5,
    color: '#16204E',
    fontSize: 12,
    width: '20%',
    borderRight: '1px solid #16204E',
  },
  tableBodyWarranty: {
    padding: 5,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '10%',
    borderRight: '1px solid #16204E',
  },
  tableBodyProb: {
    padding: 5,
    color: '#16204E',
    fontSize: 12,
    width: '15%',
    borderRight: '1px solid #16204E',
  },
  tableBodyConstat: {
    padding: 5,
    color: '#16204E',
    fontSize: 12,
    width: '10%',
    borderRight: '1px solid #16204E',
  },
  tableBodyComment: {
    padding: 5,
    color: '#16204E',
    fontSize: 12,
    width: '10%',
    borderRight: '1px solid #16204E',
  },
  tableBodySolution: {
    padding: 5,
    color: '#16204E',
    fontSize: 12,
    width: '20%',
  },

  pageTexteOne: {
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
  pageTexteTwo: {
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 10,
    fontSize: 8,
    textAlign: 'left',
    width: '80%',
    fontWeight: 'bold',
    color: '#16204E',
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

type AppViewRmaViewDeliveryViewPdfModalViewPdfComponentProps = Readonly<{
  rma: AssistanceResponseDto;
}>;
export default function AppViewRmaViewDeliveryViewPdfModalViewPdfComponent({ rma }: AppViewRmaViewDeliveryViewPdfModalViewPdfComponentProps) {
  return (
    <Document title={rma.number} author="VIZEO" creator="VIZEO" producer="VIZEO">
      <Page size="A4" style={pageStyles.page}>
        <View style={pageStyles.container}>
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
              <Text style={pageStyles.enterpriseName}>{rma.addressCompanyName}</Text>
              <Text style={pageStyles.enterpriseContact}>{rma.addressName}</Text>
              <Text style={pageStyles.enterpriseAddress}>{rma.addressOne}</Text>
              <Text style={pageStyles.enterpriseAddress}>{rma.addressTwo}</Text>
              <Text style={pageStyles.enterpriseAddress}>
                {rma.addressZipCode} {rma.addressCity}
              </Text>
            </View>
          </View>

          <View>
            <View style={pageStyles.quoteHeader}>
              <Text style={pageStyles.quoteHeaderText}>
                RMA n° {rma.number} (Analyse/Réparation/Expédition) du {formatDateWithSlash(rma.assistanceDelivery?.createdDate)}
              </Text>
              <Text style={pageStyles.quoteHeaderLine}></Text>
            </View>
          </View>

          <View style={pageStyles.table}>
            <View style={pageStyles.tableHeader}>
              <Text style={pageStyles.tableHeaderRef}>Référence</Text>
              <Text style={pageStyles.tableHeaderNumber}>N° Série</Text>
              <Text style={pageStyles.tableHeaderWarranty}>Garantie</Text>
              <Text style={pageStyles.tableHeaderProb}>Problème</Text>
              <Text style={pageStyles.tableHeaderComment}>Commentaire</Text>
              <Text style={pageStyles.tableHeaderConstat}>Constat</Text>
              <Text style={pageStyles.tableHeaderSolution}>Solution</Text>
            </View>

            <View style={pageStyles.tableBody}>
              {rma.assistanceDelivery?.details?.map((item, key) => (
                <View wrap={false} key={key} style={pageStyles.tableBodyRow}>
                  <Text style={pageStyles.tableBodyRef}>{item.productRef}</Text>
                  <Text style={pageStyles.tableBodyNumber}>{item.productSerialNumber}</Text>
                  <Text style={pageStyles.tableBodyWarranty}>{item.warranty ? 'Oui' : 'Non'}</Text>
                  <Text style={pageStyles.tableBodyProb}>{item.issue}</Text>
                  <Text style={pageStyles.tableBodyComment}>{item.comment}</Text>
                  <Text style={pageStyles.tableBodyConstat}>{item.found ? 'Oui' : 'Non'}</Text>
                  <Text style={pageStyles.tableBodySolution}>{item.solution}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text fixed style={pageStyles.pageTexteOne}>
          La T.V.A sur les prestations {"n'est"} déductible que sur le montant effectivement payé. Conformément à {"l'article"} L. 441-6 du code decommerce, des
          pénalités de retard sont due à defaut de réglement le jour suivant la date de paiement qui figure sur la facture. Le taux {"d'intérêt"} de ces
          pénalités de retard est de 25% annuels. Aucun escompte consenti pour paiement anticipé.
        </Text>
        <Text style={pageStyles.pageTexteTwo} fixed>
          SAS VIZEO au capital de 200 000€ - N° TVA : FR76 444 947 816 - Code NAF : 4669A
        </Text>
        <Text style={pageStyles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
