import FontDinRegular from '../../../../../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import ProductResponseDto from '../../../../../../../../../../../../../../utils/types/ProductResponseDto';
import moment from 'moment';
import CoverImage from '../../../../../../../../../../../../../../assets/images/synoptic_cover_bg.jpg';
import BusinessResponseDto from '../../../../../../../../../../../../../../utils/types/BusinessResponseDto';

Font.register({
  family: 'DIN',
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

const coverPageStyle = StyleSheet.create({
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
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    marginTop: '65%',
    marginLeft: '80%',
  },
});

const synopticPageStyle = StyleSheet.create({
  synoptic: {
    width: '100%',
    height: '100%',
    fontFamily: 'DIN',
    image: {
      height: '100%',
    },
  },
});

const cameraDensityPageStyle = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    padding: 20,
    fontFamily: 'DIN',
  },
  sectionOne: {
    margin: 10,
    height: '98%',
  },
  image: {
    height: 400,
    width: 800,
    marginTop: 5,
  },
});

const hddCalculationPageStyle = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    padding: 20,
    fontFamily: 'DIN',
  },
  sectionOne: {
    margin: 10,
    height: '98%',
  },
  calculation: {
    marginTop: 15,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  column: {
    flex: 1,
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameras: {
    display: 'flex',
    flexDirection: 'column',
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
  cameraQuantity: {
    marginLeft: '6',
    marginRight: '6',
    lineHeight: '1',
    color: 'red',
  },
  cameraImage: {
    marginLeft: '6',
    marginRight: '6',
    height: 40,
    width: 50,
  },
  cameraReference: {
    marginLeft: '6',
    marginRight: '6',
    lineHeight: '1',
    color: '#16204e',
  },
  configuration: {
    display: 'flex',
    flexDirection: 'column',
  },
  configurationBody: {
    display: 'flex',
    flexDirection: 'row',
  },
  configurationSection: {
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
    fontSize: '20',
    color: 'red',
    textAlign: 'center',
  },
  configurationPurpose: {
    marginTop: '10',
    color: '#16204e',
    textAlign: 'center',
  },
  footer: {
    margin: 10,
    display: 'flex',
    flexDirection: 'row',
    columnGap: 1,
  },
  disclaimer: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  disclaimerLine: {
    display: 'flex',
    flexDirection: 'row',
  },
  disclaimerLineImportant: {
    color: 'red',
  },
  comment: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    borderLeftWidth: 2,
    paddingLeft: 10,
  },
});

type AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponentProps = Readonly<{
  images: Array<Blob>;
  cameras: Array<{ product: ProductResponseDto; quantity: number }>;
  hddSpace: number;
  hddCalculationDays: number;
  business: BusinessResponseDto;
  showDensityImages: boolean;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent({
  images,
  cameras,
  hddSpace,
  hddCalculationDays,
  business,
  showDensityImages,
}: AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponentProps) {
  return (
    <Document title="VIZEO" author="VIZEO" creator="VIZEO" producer="VIZEO">
      <Page wrap={false} size="A4" style={coverPageStyle.page} orientation="landscape">
        <Image src={CoverImage} style={coverPageStyle.image} />
        <View style={coverPageStyle.body}>
          <Text style={coverPageStyle.title}>{business.title ?? ''}</Text>
          <Text>Ref dossier: {business.numBusiness ?? 'Non fournie'}</Text>
        </View>
        <View style={coverPageStyle.footer}>
          <Text>{moment().format('DD/MM/YYYY HH:mm')}</Text>
        </View>
      </Page>
      {images.map((image, index) => (
        <Page key={index} size="A4" style={synopticPageStyle.synoptic} orientation="landscape">
          <Image src={image} style={synopticPageStyle.synoptic.image} />
        </Page>
      ))}
      {showDensityImages
        ? cameras
            .filter((camera) => camera.product.category !== 'Autres cameras')
            .map((camera) => (
              <Page key={camera.product.id} size="A4" style={cameraDensityPageStyle.page} orientation="landscape">
                <View style={cameraDensityPageStyle.sectionOne}>
                  <Image
                    src={`https://bd.vizeo.eu/6-Photos/${camera.product.reference}/DENSITE_MAX_${camera.product.reference}.jpg`}
                    style={cameraDensityPageStyle.image}
                  />
                </View>
              </Page>
            ))
        : null}
      {!!hddSpace && !!hddCalculationDays && Number.isFinite(hddCalculationDays) && (
        <Page size="A4" style={hddCalculationPageStyle.page} orientation="landscape">
          <View style={hddCalculationPageStyle.sectionOne}>
            <View style={hddCalculationPageStyle.calculation}>
              <View style={hddCalculationPageStyle.column}>
                <Text style={hddCalculationPageStyle.header}>Caméras</Text>
                <View style={hddCalculationPageStyle.cameras}>
                  {cameras.map((camera) => (
                    <View key={camera.product.id} style={hddCalculationPageStyle.camera}>
                      <View style={hddCalculationPageStyle.cameraBody}>
                        <Text style={hddCalculationPageStyle.cameraQuantity}>x {camera.quantity}</Text>
                        <Image
                          src={`https://bd.vizeo.eu/6-Photos/${camera.product.reference}/${camera.product.reference}.jpg`}
                          style={hddCalculationPageStyle.cameraImage}
                        />
                        <Text style={hddCalculationPageStyle.cameraReference}>{camera.product.reference}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View style={hddCalculationPageStyle.column}>
                <Text style={hddCalculationPageStyle.header}>Configuration</Text>
                <View style={hddCalculationPageStyle.configuration}>
                  <View style={hddCalculationPageStyle.configurationBody}>
                    <View style={hddCalculationPageStyle.configurationSection}>
                      <Text style={hddCalculationPageStyle.configurationValue}>
                        {new Intl.NumberFormat('fr-FR', {
                          maximumFractionDigits: 2,
                        }).format(hddCalculationDays)}{' '}
                        {hddCalculationDays > 1 ? 'jours' : 'jour'}
                      </Text>
                      <Text style={hddCalculationPageStyle.configurationPurpose}>{"Durée de l'enregistrement"}</Text>
                    </View>
                    <View style={hddCalculationPageStyle.configurationSection}>
                      <Text style={hddCalculationPageStyle.configurationValue}>
                        {new Intl.NumberFormat('fr-FR', {
                          maximumFractionDigits: 2,
                        }).format(hddSpace)}{' '}
                        To
                      </Text>
                      <Text style={hddCalculationPageStyle.configurationPurpose}>{"D'espace disque dur"}</Text>
                    </View>
                  </View>

                  <View style={hddCalculationPageStyle.configurationBody}>
                    <View style={hddCalculationPageStyle.configurationSection}>
                      <Text style={hddCalculationPageStyle.configurationValue}>24h/24</Text>
                      <Text style={hddCalculationPageStyle.configurationPurpose}>{"D'enregistrement par jour"}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={hddCalculationPageStyle.footer}>
              <View style={hddCalculationPageStyle.disclaimer}>
                <View style={hddCalculationPageStyle.disclaimerLine}>
                  <Text style={hddCalculationPageStyle.disclaimerLineImportant}>* </Text>
                  <Text>Calcul avec les paramètres au maximum</Text>
                </View>
                <Text>- 24h/24</Text>
                <Text>- 25 images par seconde (temps réel)</Text>
                <Text>- 2 flux vidéo par canal</Text>
                <Text>Dans un usage normal, vous pouvez estimer 2 à 3 fois ce temps.</Text>
              </View>
              {/* <View style={hddCalculationPageStyle.comment}> // TODO: reimplement this
              <Text style={hddCalculationPageStyle.commentText}>{line}</Text>
            </View> */}
            </View>
            {/* <Config business={business} /> */}
          </View>
        </Page>
      )}
    </Document>
  );
}
