import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import FontDinRegular from '../../../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import Logo from '../../../../../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import { CreateMailFormType } from '../../../FormModal/FormModal';
import ProfileInfoResponseDto from '../../../../../../../../../../../../utils/types/ProfileInfoResponseDto';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

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
  gridTwo: {
    minWidth: '200px',
  },
  logo: {
    height: 65,
    width: 200,
    marginBottom: 20,
    marginLeft: 10,
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
  contact: {
    textTransform: 'uppercase',
    lineHeight: 1.5,
    fontSize: 13,
    color: '#16204E',
  },
  address: {
    lineHeight: 1.2,
    fontSize: 13,
    color: '#16204E',
  },

  date: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    lineHeight: 2,
    fontSize: 12,
    color: '#16204E',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10,
  },
  sectionThree: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 1.2,
    color: '#16204E',
    fontWeight: 'bold',
  },
  sectionFour: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sectionFourBody: {
    marginBottom: 15,
    fontSize: 12,
    lineHeight: 1.2,
    color: '#16204E',
  },
  sectionFive: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    fontSize: 12,
    lineHeight: 1.2,
    color: '#16204E',
  },
  signature: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },

  pageFooterText: {
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

type AppViewToolsViewMailsViewCreateModalViewPdfModalComponentPdfComponentProps = Readonly<{
  mail: CreateMailFormType;
  user: ProfileInfoResponseDto;
}>;
export default function AppViewToolsViewMailsViewCreateModalViewPdfModalComponentPdfComponent({
  mail,
  user,
}: AppViewToolsViewMailsViewCreateModalViewPdfModalComponentPdfComponentProps) {
  return (
    <Document title="Courrier" author="VIZEO" creator="VIZEO" producer="VIZEO">
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
            <View style={pageStyles.gridTwo}>
              <Text style={pageStyles.contact}>{mail.enterprise.name}</Text>
              <Text style={pageStyles.contact}>
                {mail.contact.firstName} {mail.contact.lastName}
              </Text>
              <Text style={pageStyles.address}>{mail.addressOne}</Text>
              <Text style={pageStyles.address}>{mail.addressTwo}</Text>
              <Text style={pageStyles.address}>
                {mail.zipCode} {mail.city}
              </Text>
            </View>
          </View>

          <View style={pageStyles.sectionThree}>
            <Text>Objet: {mail.object}</Text>
          </View>

          <View style={pageStyles.date}>
            <Text>Villeurbanne, le {format(new Date(), 'cccc, dd/MM/yyyy', { locale: fr })}</Text>
          </View>

          <View style={pageStyles.sectionFour}>
            {mail.sections.map((item, index) => (
              <Text wrap={false} key={index} style={pageStyles.sectionFourBody}>
                {item.content}
              </Text>
            ))}
          </View>

          <View wrap={false} style={pageStyles.sectionFive}>
            <View style={pageStyles.signature}>
              <Text wrap={false}>Cordialement,</Text>
              <Text wrap={false}>
                {user.profile.lastName} {user.profile.firstName}
              </Text>
              <Text wrap={false}>{user.userInfo.email}</Text>
              <Text wrap={false}>04 72 12 27 96</Text>
              <Text wrap={false}>https://www.vizeo.eu</Text>
            </View>
          </View>
        </View>
        <Text style={pageStyles.pageFooterText} fixed>
          SAS VIZEO au capital de 200 000€ - N° TVA : FR76 444 947 816 - Code NAF : 4669A
        </Text>
        <Text style={pageStyles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  );
}
