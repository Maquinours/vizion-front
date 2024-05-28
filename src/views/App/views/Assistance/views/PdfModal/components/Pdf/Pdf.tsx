import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import FontDinRegular from '../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import Logo from '../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import TechnicalSupportResponseDto from '../../../../../../../../utils/types/TechnicalSupportResponseDto';
import { format } from 'date-fns';

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
    padding: '50px',
    fontFamily: 'Din',
    position: 'relative',
    paddingBottom: 70,
    color: '#16204E',
  },
  body: {
    position: 'relative',
  },
  bold: {
    fontWeight: 'bold',
    color: '#16204E',
  },
  sectionOne: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 80,
  },

  gridOne: {
    width: '70%',
    paddingRight: '30px',
  },
  title: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 2,
  },
  detail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
    borderBottom: '1px dotted #16204E',
  },
  detailTitle: {
    fontSize: 13,
  },
  detailContent: {
    fontSize: 13,
    position: 'relative',
    top: '-1px',
    alignSelf: 'flex-end',
  },
  gridTwo: {
    width: '30%',
  },
  logo: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
  sectionTwo: {
    margin: 10,
    padding: 10,
    position: 'relative',
    top: '-20px',
    display: 'flex',
    flexDirection: 'column',
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
  container: {
    borderLeft: '1px solid £',
    marginBottom: 50,
  },
  info: {
    fontSize: '13px',
    marginBottom: 10,
  },
  sectionTwoDetail: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  sectionTwoDetailNumber: {
    fontWeight: 'bold',
    fontSize: '30px',
    color: '#F24C52',
    marginRight: 30,
    marginLeft: 30,
  },
  sectionTwoDetailContent: {
    flexWrap: 'wrap',
    width: '100%',
    fontSize: '16px',
  },
  sectionTwoDetailContentLink: {
    fontSize: '12px',
    color: '#F24C52',
  },
  footer: {
    backgroundColor: '#16204E',
    borderRadius: 10,
    padding: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footerNumber: {
    fontWeight: 'bold',
  },
});

type AppViewAssistanceViewPdfModalViewPdfComponentProps = Readonly<{
  assistance: TechnicalSupportResponseDto;
}>;
export default function AppViewAssistanceViewPdfModalViewPdfComponent({ assistance }: AppViewAssistanceViewPdfModalViewPdfComponentProps) {
  const expiredDate = (() => {
    const date = new Date(assistance.createdDate);
    date.setFullYear(date.getFullYear() + 1);
    return date;
  })();

  return (
    <Document title={`Assistance ${assistance.businessNumber}`} author="VIZEO" creator="VIZEO" producer="VIZEO" keywords="assistance,vizeo,support">
      <Page size="A4" style={pageStyles.page}>
        <View style={pageStyles.body}>
          <View style={pageStyles.sectionOne}>
            <View style={pageStyles.gridOne}>
              <Text style={pageStyles.title}>Votre</Text>
              <Text style={pageStyles.subtitle}>Assistance téléphonique</Text>
              <View style={pageStyles.detailsContainer}>
                <View style={pageStyles.detail}>
                  <Text style={pageStyles.detailTitle}>Durée</Text>
                  <Text style={pageStyles.detailContent}>{assistance.predefinedTime}</Text>
                </View>
                <View style={pageStyles.detail}>
                  <Text style={pageStyles.detailTitle}>Valable jusqu’au</Text>
                  <Text style={pageStyles.detailContent}>{format(expiredDate, 'dd/MM/yyyy')}</Text>
                </View>
                <View style={pageStyles.detail}>
                  <Text style={pageStyles.detailTitle}>Votre numéro de dossier</Text>
                  <Text style={pageStyles.detailContent}>{assistance.businessNumber}</Text>
                </View>
                <View style={pageStyles.detail}>
                  <Text style={pageStyles.detailTitle}>Nom de l’affaire</Text>
                  <Text style={pageStyles.detailContent}>{assistance.businessTitle}</Text>
                </View>
              </View>
            </View>
            <View style={pageStyles.gridTwo}>
              <Image src={Logo} style={pageStyles.logo} />
            </View>
            <View></View>
          </View>
          <View style={pageStyles.sectionTwo}>
            <Text style={pageStyles.info}>Les pré-requis</Text>

            <View style={pageStyles.container}>
              <View style={pageStyles.sectionTwoDetail}>
                <Text style={pageStyles.sectionTwoDetailNumber}>1</Text>
                <Text style={pageStyles.sectionTwoDetailContent} wrap={false}>
                  Vos <Text style={pageStyles.bold}>caméras</Text> et votre <Text style={pageStyles.bold}>enregistreur</Text> sont{' '}
                  <Text style={pageStyles.bold}>installés sur votre réseau</Text>
                </Text>
              </View>
              <View style={pageStyles.sectionTwoDetail}>
                <Text style={pageStyles.sectionTwoDetailNumber}>2</Text>
                <Text style={pageStyles.sectionTwoDetailContent} wrap={false}>
                  Vous disposez d’un <Text style={pageStyles.bold}>PC connecté au réseau</Text>
                </Text>
              </View>
              <View style={pageStyles.sectionTwoDetail}>
                <Text style={pageStyles.sectionTwoDetailNumber}>3</Text>
                <Text style={pageStyles.sectionTwoDetailContent} wrap={false}>
                  Sur ce PC, téléchargez et installez VizeoDesk sur :<Text style={pageStyles.sectionTwoDetailContentLink}> https://desk.vizeo.eu</Text>
                </Text>
              </View>
              <View style={pageStyles.sectionTwoDetail}>
                <Text style={pageStyles.sectionTwoDetailNumber}>4</Text>
                <Text style={pageStyles.sectionTwoDetailContent} wrap={false}>
                  Ayez à disposition : Les <Text style={pageStyles.bold}>codes d’accès de la box internet</Text> liée au réseau Votre{' '}
                  <Text style={pageStyles.bold}>numéro de dossier</Text> (ci-dessus)
                </Text>
              </View>
              <View style={pageStyles.sectionTwoDetail}>
                <Text style={pageStyles.sectionTwoDetailNumber}>5</Text>
                <Text style={pageStyles.sectionTwoDetailContent} wrap={false}>
                  Téléchargez <Text style={pageStyles.bold}>myVizeo 2.0</Text> {"sur mobile via le Play Store ou l'App Store."}
                </Text>
              </View>
            </View>
          </View>
          <View style={pageStyles.footer}>
            <Text>Appelez-nous ensuite au</Text>
            <Text style={pageStyles.footerNumber}>04 72 12 27 96</Text>
            <Text>Du lundi au vendredi, de 9h à 12h et de 13h30 à 16h30</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
