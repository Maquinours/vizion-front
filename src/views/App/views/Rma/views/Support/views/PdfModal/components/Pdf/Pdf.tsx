import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import AssistanceResponseDto from '../../../../../../../../../../utils/types/AssistanceResponseDto';
import Logo from '../../../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import FontDinRegular from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
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
    padding: 20,
    fontFamily: 'Din',
  },
  pageContainer: {
    paddingBottom: 38,
  },
  sectionOne: {
    margin: 10,
    padding: 10,
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
  quoteHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteHeaderText: {
    width: '60%',
    color: '#16204E',
    fontSize: '15',
  },
  quoteHeaderLine: {
    width: '40%',
    borderTop: '1px solid #16204E',
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
    textOverflow: 'ellipsis',
    maxLines: 1,
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
  tableContainer: {
    marginTop: 10,
    marginBottom: 10,
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
    fontWeight: 'bold',
  },
  tableHeaderRef: {
    padding: 10,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
  },
  tableHeaderNumber: {
    padding: 10,
    color: 'white',
    fontSize: 13,
    width: '25%',
    borderRight: '1px solid white',
  },
  tableHeaderProblem: {
    padding: 10,
    color: 'white',
    fontSize: 13,
    width: '60%',
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
  },
  tableBodyRef: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '15%',
    borderBottom: '1px solid #16204E',
    borderRight: '1px solid #16204E',
  },
  tableBodyNumber: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '25%',
    borderBottom: '1px solid #16204E',
    borderRight: '1px solid #16204E',
  },
  tableBodyProblem: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '60%',
    borderBottom: '1px solid #16204E',
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

type AppViewRmaViewSupportViewPdfModalViewPdfComponentProps = Readonly<{
  rma: AssistanceResponseDto;
}>;
export default function AppViewRmaViewSupportViewPdfModalViewPdfComponent({ rma }: AppViewRmaViewSupportViewPdfModalViewPdfComponentProps) {
  return (
    <Document title={rma.number} author="VIZEO" creator="VIZEO" producer="VIZEO">
      <Page size="A4" style={pageStyles.page}>
        <View style={pageStyles.pageContainer}>
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
              <Text style={pageStyles.enterpriseAddress}>{rma?.addressTwo}</Text>
              <Text style={pageStyles.enterpriseAddress}>
                {rma.addressZipCode} {rma.addressCity}
              </Text>
            </View>
          </View>

          <View>
            <View style={pageStyles.quoteHeader}>
              <Text style={pageStyles.quoteHeaderText}>
                RMA n° {rma.number} (Prise en charge) du {formatDateWithSlash(rma.assistanceSupport?.createdDate)}
              </Text>
              <Text style={pageStyles.quoteHeaderLine}></Text>
            </View>
          </View>

          <View style={pageStyles.tableContainer}>
            <View style={pageStyles.tableHeaderContainer}>
              <Text style={pageStyles.tableHeaderRef}>Référence</Text>
              <Text style={pageStyles.tableHeaderNumber}>N° Série</Text>
              <Text style={pageStyles.tableHeaderProblem}>Problème</Text>
            </View>

            <View style={pageStyles.tableBody}>
              {rma.assistanceSupport?.details?.map((item, key) => (
                <View wrap={false} key={key} style={pageStyles.tableBodyRow}>
                  <Text style={pageStyles.tableBodyRef}>{item.productRef}</Text>
                  <Text style={pageStyles.tableBodyNumber}>{item.productSerialNumber}</Text>
                  <Text style={pageStyles.tableBodyProblem}>{item.issue}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <Text fixed style={pageStyles.pageTexteOne}>
          La T.V.A sur les prestations {"n'est"} déductible que sur le montant effectivement payé. Conformément à {"l'article"} L. 441-6 du code de commerce,
          des pénalités de retard sont due à defaut de réglement le jour suivant la date de paiement qui figure sur la facture. Le taux {"d'intérêt"} de ces
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
