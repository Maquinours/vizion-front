import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import FontDIN2014DemiBold from '../../../../../../../../../../../../../../assets/fonts/DIN2014/DIN2014-DemiBold.ttf';
import FontDIN2014Regular from '../../../../../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FirstPageBackground from '../../../../../../../../../../../../../../assets/images/synoptic_cover_bg.jpg';
import moment from 'moment';
import BusinessResponseDto from '../../../../../../../../../../../../../../utils/types/BusinessResponseDto';
import ProductResponseDto from '../../../../../../../../../../../../../../utils/types/ProductResponseDto';

Font.register({
  family: 'DIN',
  fonts: [
    {
      src: FontDIN2014Regular,
    },
    {
      src: FontDIN2014DemiBold,
      fontWeight: 'bold',
    },
  ],
});

const coverPageStyles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    fontFamily: 'DIN',
  },
  image: {
    height: '100%',
    position: 'relative',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    maxWidth: '300',
    marginTop: '35%',
    marginLeft: '50%',
  },
  title: {
    color: '#16204E',
    fontSize: '30',
    fontWeight: 700,
  },
  footer: {
    position: 'absolute',
    marginTop: '65%',
    marginLeft: '80%',
  },
});

const footerStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  body: {
    display: 'flex',
    flexDirection: 'row',
  },
  vzo: {
    textAlign: 'left',
    width: '50%',
    padding: 10,
    fontSize: 13,
    color: '#16204E',
  },
  date: {
    textAlign: 'right',
    width: '50%',
    padding: 10,
    fontSize: 13,
    color: '#16204E',
  },
});

const synopticStyles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    fontFamily: 'DIN',
  },
  section_two: {
    padding: 11,
    height: '100%',
    width: '100%',
  },
  synoptic: {
    height: '95%',
    width: '95%',
    marginTop: 5,
    alignSelf: 'center',
  },
});

const densityStyles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    fontFamily: 'DIN',
  },
  section_one: {
    margin: 10,
    height: '98%',
  },
  camDensity: {
    height: 400,
    width: 800,
    marginTop: 5,
    alignSelf: 'center',
  },
});

const calculStyles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    fontFamily: 'DIN',
  },
  section_one: {
    margin: 10,
    height: '98%',
  },
  container: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bodyCamera: {
    display: 'flex',
    flexDirection: 'column',
  },
  column: {
    flex: 1,
  },
  camera: {
    border: '2px solid #16204E',
    borderTopLeftRadius: '5',
    borderTopRightRadius: '5',
    borderBottomRightRadius: '5',
    borderBottomLeftRadius: '5',
    margin: '2',
  },
  cameraBody: {
    display: 'flex',
    flexDirection: 'row',
    padding: '5',
    alignItems: 'center',
  },
  cameraBodyQuantity: {
    marginLeft: '6',
    marginRight: '6',
    lineHeight: '1',
    color: 'red',
  },
  cameraBodyImage: {
    marginLeft: '6',
    marginRight: '6',
    height: 40,
    width: 50,
  },
  cameraBodyReference: {
    marginLeft: '6',
    marginRight: '6',
    lineHeight: '1',
    color: '#16204e',
  },
  bodyConfiguration: {
    display: 'flex',
    flexDirection: 'column',
  },
  configuration: {
    display: 'flex',
    flexDirection: 'row',
    body: {
      value: {},
      purpose: {},
    },
  },
  configurationBody: {
    display: 'flex',
    flexDirection: 'column',
    margin: '5',
    padding: '30',
    alignItems: 'center',
    border: '2px solid #16204E',
    borderTopLeftRadius: '5',
    borderTopRightRadius: '5',
    borderBottomRightRadius: '5',
    borderBottomLeftRadius: '5',
    height: '150',
    width: '200',
  },
  configurationValue: {
    fontSize: '25',
    color: 'red',
    textAlign: 'center',
  },
  configurationPurpose: {
    marginTop: '10',
    color: '#16204e',
    textAlign: 'center',
  },
  disclaimer: {
    margin: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  disclaimerLine: {
    display: 'flex',
    flexDirection: 'row',
  },
  disclaimerLineImportant: {
    color: 'red',
  },
});

const amountFormat = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount);

type AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponentPdfComponentProps = Readonly<{
  business: BusinessResponseDto;
  cameras: Array<{ quantity: number; product: ProductResponseDto }>;
  synopticImage: Blob;
  hddResult: number;
  nvrCapacity: number | null | undefined;
}>;
export default function AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponentPdfComponent({
  business,
  cameras,
  synopticImage,
  hddResult,
  nvrCapacity,
}: AppViewStudyViewAutomaticViewFooterComponentStepTwoComponentPdfModalComponentPdfComponentProps) {
  const footer = (
    <View style={footerStyles.container} wrap={false}>
      <View style={footerStyles.body}>
        <Text style={footerStyles.vzo}>{business.numBusiness}</Text>
        <Text style={footerStyles.date}>{moment().format('DD-MM-YYYY')}</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={coverPageStyles.page} orientation="landscape">
        <View>
          <Image src={FirstPageBackground} style={coverPageStyles.image} />
          <View style={coverPageStyles.body}>
            <Text style={coverPageStyles.title}>{business.title ?? ''}</Text>
            <Text>Ref dossier: {business.numBusiness ?? 'Non fournie'}</Text>
          </View>
          <View style={coverPageStyles.footer}>
            <Text>{moment().format('DD-MM-YYYY HH:mm')}</Text>
          </View>
        </View>
      </Page>
      <Page size="A4" style={synopticStyles.page} orientation="landscape">
        <View style={synopticStyles.section_two}>
          <Image src={synopticImage} style={synopticStyles.synoptic} />
          {footer}
        </View>
      </Page>
      {cameras.map((camera) => (
        <Page key={camera.product.id} size="A4" style={densityStyles.page} orientation="landscape">
          <View style={densityStyles.section_one}>
            <Image
              src={`https://bd.vizeo.eu/6-Photos/${camera.product.reference}/DENSITE_MAX_${camera.product.reference}.jpg`}
              style={densityStyles.camDensity}
            />
            {footer}
          </View>
        </Page>
      ))}
      <Page size="A4" style={calculStyles.page} orientation="landscape">
        <View style={calculStyles.section_one}>
          <View style={calculStyles.container}>
            <View style={calculStyles.column}>
              <Text style={calculStyles.header}>Caméras</Text>
              <View style={calculStyles.bodyCamera}>
                {cameras.map((camera) => (
                  <View key={camera.product.id} style={calculStyles.camera}>
                    <View style={calculStyles.cameraBody}>
                      <Text style={calculStyles.cameraBodyQuantity}>x {camera.quantity}</Text>
                      <Image
                        src={`https://bd.vizeo.eu/6-Photos/${camera.product.reference}/${camera.product.reference}.jpg`}
                        style={calculStyles.cameraBodyImage}
                      />
                      <Text style={calculStyles.cameraBodyReference}>{camera.product.reference}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={calculStyles.column}>
              <Text style={calculStyles.header}>Configuration</Text>
              <View style={calculStyles.bodyConfiguration}>
                <View style={calculStyles.configuration}>
                  <View style={calculStyles.configurationBody}>
                    <Text style={calculStyles.configurationValue}>
                      {amountFormat(hddResult)}* à {amountFormat(hddResult * 2)} jours
                    </Text>
                    <Text style={calculStyles.configurationPurpose}>{"Durée de l'enregistrement"}</Text>
                  </View>
                  <View style={calculStyles.configurationBody}>
                    <Text style={calculStyles.configurationValue}>{nvrCapacity ?? 'Inconnu'} To</Text>
                    <Text style={calculStyles.configurationPurpose}>{"D'espace disque dur"}</Text>
                  </View>
                </View>

                <View style={calculStyles.configuration}>
                  <View style={calculStyles.configurationBody}>
                    <Text style={calculStyles.configurationValue}>24h/24</Text>
                    <Text style={calculStyles.configurationPurpose}>{"D'enregistrement par jour"}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={calculStyles.disclaimer}>
            <View style={calculStyles.disclaimerLine}>
              <Text style={calculStyles.disclaimerLineImportant}>* </Text>
              <Text>Calcul avec les paramètres au maximum</Text>
            </View>
            <Text>- 24h/24</Text>
            <Text>- 25 images par seconde (temps réel)</Text>
            <Text>- 2 flux vidéo par canal</Text>
            <Text>Dans un usage normal, vous pouvez estimer 2 à 3 fois ce temps.</Text>
          </View>
          {footer}
        </View>
      </Page>
    </Document>
  );
}
