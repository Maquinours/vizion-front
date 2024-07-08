import FontDinRegular from '../../../../../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import { Document, Font, Image, Page, StyleSheet, View } from '@react-pdf/renderer';

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

const synopticPageStyle = StyleSheet.create({
  synoptic: {
    width: '100%',
    height: '100%',
    fontFamily: 'DIN',
    image: {
      height: 570,
      width: 850,
    },
  },
});

type AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponentProps = Readonly<{
  images: Array<Blob>;
}>;
export default function AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponent({
  images,
}: AppViewStudyViewExpertViewModalProviderComponentPdfModalComponentShowStepComponentPdfComponentProps) {
  return (
    <Document title="VIZEO" author="VIZEO" creator="VIZEO" producer="VIZEO">
      {images.map((image, index) => (
        <Page key={index} size="A4" style={synopticPageStyle.synoptic} orientation="landscape">
          <View>
            <Image src={image} style={synopticPageStyle.synoptic.image} />
          </View>
        </Page>
      ))}
    </Document>
  );
}
