import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import FontDinRegular from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Regular.ttf';
import FontDinBold from '../../../../../../../../../../assets/fonts/DIN2014/DIN2014-Bold.ttf';
import Logo from '../../../../../../../../../../assets/images/logo-vizeo-fond-blanc-baseline.png';
import BusinessResponseDto from '../../../../../../../../../../utils/types/BusinessResponseDto';
import BusinessQuotationResponseDto from '../../../../../../../../../../utils/types/BusinessQuotationResponseDto';
import { formatDateWithSlash } from '../../../../../../../../../../utils/functions/dates';
import React, { useMemo } from 'react';

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
    position: 'relative',
    paddingBottom: 70,
  },
  sectionOne: {
    margin: 10,
    padding: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionOneGridTwo: {
    minWidth: '200px',
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
    width: '20%',
    color: '#16204E',
  },
  quoteHeaderLine: {
    width: '80%',
    borderTop: '1px solid #16204E',
  },
  quoteDetail: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  quoteDetailOne: {
    width: '100%',
    borderRight: '1px solid #16204E',
    paddingLeft: 10,
  },
  quoteDetailOneContainer: {
    marginBottom: 10,
  },
  quoteDetailOneTitle: {
    color: '#31385A',
    fontSize: 13,
    fontWeight: 'bold',
  },
  quoteDetailOneContent: {
    color: '#F24C52',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quoteDetailTwo: {
    width: '100%',
    paddingLeft: 10,
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
  tableContainer: {
    margin: 10,
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
  imageHeader: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    borderRight: '1px solid white',
    textAlign: 'center',
  },
  quantityHeader: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '10%',
    borderRight: '1px solid white',
    textAlign: 'center',
  },
  referenceHeader: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
    textAlign: 'center',
  },
  descriptionHeader: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '35%',
    borderRight: '1px solid white',
    textAlign: 'center',
  },
  priceHeader: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    borderRight: '1px solid white',
    textAlign: 'center',
  },
  totalHeader: {
    padding: 5,
    color: 'white',
    fontSize: 13,
    width: '15%',
    flex: '100px 1 1',
    borderRight: '1px solid white',
    textAlign: 'center',
  },
  tableBodyContainer: {
    width: '100%',
    height: 'auto',
  },
  subQuoteNameContainer: {
    height: 'auto',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
  },
  subQuoteName: {
    color: '#485176',
    fontSize: 13,
    fontWeight: 'bold',
  },
  totalContainer: {
    height: 'auto',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
  },
  total: {
    textAlign: 'right',
    color: '#485176',
    fontSize: 13,
    fontWeight: 'bold',
    borderTop: '1px solid #485176',
    paddingTop: 5,
    marginTop: 20,
  },
  totalNameBody: {
    textAlign: 'right',
    color: '#485176',
    fontSize: 13,
    fontWeight: 'bold',
    borderTop: '1px solid #485176',
    paddingTop: 5,
    marginTop: 20,
  },
  tableBody: {
    display: 'flex',
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    gap: 0,
  },
  imageBody: {
    width: '10%',
    objectFit: 'scale-down',
    borderTop: '1px solid #16204E',
    textAlign: 'center',
  },
  quantityBody: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '10%',
    borderTop: '1px solid #16204E',
    textAlign: 'center',
  },
  referenceBody: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '15%',
    borderTop: '1px solid #16204E',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },
  descriptionBody: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '35%',
    borderTop: '1px solid #16204E',
    textAlign: 'center',
  },
  priceBody: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '15%',
    borderTop: '1px solid #16204E',
    textAlign: 'center',
  },
  totalBody: {
    padding: 10,
    minHeight: 30,
    color: '#16204E',
    fontSize: 12,
    width: '15%',
    borderTop: '1px solid #16204E',
    textAlign: 'center',
  },
  recapContainer: {
    marginTop: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recap: {
    width: '350px',
  },
  recapHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#16204E',
    color: 'white',
  },
  recapHeaderText: {
    width: '70%',
    padding: 5,
    fontSize: 13,
    borderRight: '1px solid white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recapHeaderValue: {
    width: '30%',
    padding: 5,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recapBody: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #16204E',
  },
  recapBodyText: {
    width: '40%',
    padding: 5,
    fontSize: 13,
    color: '#16204E',
    borderRight: '1px solid #16204E',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recapBodyValue: {
    width: '30%',
    padding: 5,
    fontSize: 13,
    color: '#16204E',
    borderRight: '1px solid #16204E',
    textAlign: 'center',
  },
  recapFooter: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#16204E',
    color: 'white',
  },
  recapFooterText: {
    width: '70%',
    padding: 5,
    fontSize: 13,
    borderRight: '1px solid white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recapFooterValue: {
    width: '30%',
    padding: 5,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pageTextOne: {
    fontSize: 8,
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 25,
    textAlign: 'left',
    width: '80%',
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

const amountFormatter = (value: number) => {
  return value.toLocaleString('fr-FR').replaceAll('\u202f', ' ');
};

const currencyFormatter = (value: number) => {
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }).replaceAll('\u202f', ' ');
};

type AppViewBusinessViewQuotationViewPdfModalViewPdfComponentProps = {
  business: BusinessResponseDto;
  quotation: BusinessQuotationResponseDto;
  hideAddresses: boolean;
  hideReferences: boolean;
  hidePrices: boolean;
  hideTotal: boolean;
};
export default function AppViewBusinessViewQuotationViewPdfModalViewPdfComponent({
  business,
  quotation,
  hideAddresses,
  hideReferences,
  hidePrices,
  hideTotal,
}: AppViewBusinessViewQuotationViewPdfModalViewPdfComponentProps) {
  const subQuotations = useMemo(
    () => quotation.subQuotationList?.sort((a, b) => parseInt(a.orderNum ?? '', 10) - parseInt(b.orderNum ?? '', 10)),
    [quotation.subQuotationList],
  );

  const businessNumber = quotation.number.substring(0, 7) + ' ' + quotation.number.substring(7);

  return (
    <Document title={quotation.number} author="VIZEO" creator="VIZEO" producer="VIZEO">
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
            <View style={pageStyles.sectionOneGridTwo}>
              <View style={pageStyles.enterprise}>
                <Text style={pageStyles.enterpriseName}>{business.deliverAddressCompany}</Text>
                <Text style={pageStyles.enterpriseContact}>{business.deliverAddressName}</Text>
                <Text style={pageStyles.enterpriseAddress}>{business.deliverAddressOne}</Text>
                <Text style={pageStyles.enterpriseAddress}>{business.deliverAddressTwo}</Text>
                <Text style={pageStyles.enterpriseAddress}>
                  {business.deliverAddressZipCode} {business.deliverAddressCity}
                </Text>
              </View>
            </View>
          </View>

          {business.deliverAddressCompany && !hideAddresses && (
            <View style={pageStyles.sectionTwo}>
              <View style={pageStyles.enterprise}>
                <>
                  <Text style={pageStyles.enterpriseTitle}>Adresse de facturation</Text>
                  <Text style={pageStyles.enterpriseName}>{business.billingCompany}</Text>
                  {/* <Text style={pageStyles.section_two.enterprise.contact}>
                  {currentBusiness.profileName}
                </Text> */}
                  <Text style={pageStyles.enterpriseAddress}>{business.billingAddressOne}</Text>
                  <Text style={pageStyles.enterpriseAddress}>
                    {business.billingZipCode} {business.billingCity}
                  </Text>
                </>
              </View>
            </View>
          )}

          <View>
            <View style={pageStyles.quoteHeader}>
              <Text style={pageStyles.quoteHeaderText}>{quotation.documentName}</Text>
              <Text style={pageStyles.quoteHeaderLine}></Text>
            </View>
            <View style={pageStyles.quoteDetail}>
              <View style={pageStyles.quoteDetailOne}>
                <View style={pageStyles.quoteDetailOneContainer}>
                  <Text style={pageStyles.quoteDetailOneTitle}>Nom de dossier</Text>
                  <Text style={pageStyles.quoteDetailOneContent}>{business.title}</Text>
                </View>
              </View>
              <View style={pageStyles.quoteDetailOne}>
                <View style={pageStyles.quoteDetailOneContainer}>
                  <Text style={pageStyles.quoteDetailOneTitle}>Dossier</Text>
                  <Text style={pageStyles.quoteDetailOneContent}>{businessNumber}</Text>
                </View>
              </View>
              <View style={pageStyles.quoteDetailTwo}>
                <View>
                  <Text style={pageStyles.quoteDetailOneTitle}>Date de création</Text>
                  <Text style={pageStyles.quoteDetailOneContent}>{formatDateWithSlash(business.modifiedDate ?? new Date())}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={pageStyles.tableContainer}>
            <View style={pageStyles.tableHeaderContainer}>
              <Text style={pageStyles.imageHeader}>Image</Text>
              <Text style={pageStyles.quantityHeader}>Qté</Text>
              <Text style={pageStyles.referenceHeader}>Référence</Text>
              <Text style={pageStyles.descriptionHeader}>Désignation</Text>
              <Text style={pageStyles.priceHeader}>PU HT</Text>
              <Text style={pageStyles.totalHeader}>Total</Text>
            </View>

            <View style={pageStyles.tableBodyContainer}>
              {subQuotations!.map((subQuotation) => (
                <React.Fragment key={subQuotation.id}>
                  {subQuotation.name !== 'Default' && (
                    <View wrap={false} style={pageStyles.subQuoteNameContainer}>
                      <Text wrap={false} style={pageStyles.subQuoteName}>
                        {subQuotation.name}
                      </Text>
                    </View>
                  )}
                  {subQuotation.quotationDetails!.map((detail) => (
                    <View wrap={false} key={detail.id} style={pageStyles.tableBody}>
                      <Image src={`https://bd.vizeo.eu/6-Photos/${detail.productReference}/MINI_${detail.productReference}.jpg`} style={pageStyles.imageBody} />
                      <Text style={pageStyles.quantityBody}>{amountFormatter(detail.quantity ?? 0)}</Text>
                      <Text style={pageStyles.referenceBody}>{hideReferences ? '' : detail.productReference}</Text>
                      <Text style={pageStyles.descriptionBody}>{detail.productDesignation}</Text>
                      <Text style={pageStyles.priceBody}>{hidePrices ? '' : currencyFormatter(detail.unitPrice ?? 0)}</Text>
                      <Text style={pageStyles.totalBody}>{hidePrices ? '' : currencyFormatter(detail.totalPrice ?? 0)}</Text>
                    </View>
                  ))}

                  {subQuotation.quotationDetails!.length > 0 && !hideTotal && (
                    <View wrap={false} style={pageStyles.totalContainer}>
                      <Text style={pageStyles.total}>
                        Total = {currencyFormatter(subQuotation.quotationDetails?.reduce((acc, detail) => acc + detail.totalPrice!, 0) ?? 0)}
                      </Text>
                    </View>
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {!hideTotal && (
            <View style={pageStyles.recapContainer} wrap={false}>
              <View style={pageStyles.recap}>
                <View style={pageStyles.recapHeader}>
                  <Text style={pageStyles.recapHeaderText}>
                    TOTAL GÉNÉRAL HT{subQuotations?.some((subQuotation) => subQuotation.name === 'Options') ? ' avec options' : ''}
                  </Text>
                  <Text style={pageStyles.recapHeaderValue}>{currencyFormatter(quotation.totalAmountHT ?? 0)}</Text>
                </View>
                <View style={pageStyles.recapBody}>
                  <Text style={pageStyles.recapBodyText}>Frais de port</Text>
                  <Text style={pageStyles.recapBodyValue}>{currencyFormatter(quotation.shippingServicePrice)}</Text>
                  <Text style={pageStyles.recapBodyValue}>
                    {quotation.shippingServicePrice > 0 ? `${currencyFormatter(quotation.shippingServicePrice)}` : 'Offert'}
                  </Text>
                </View>
                <View style={pageStyles.recapBody}>
                  <Text style={pageStyles.recapBodyText}>TVA</Text>
                  <Text style={pageStyles.recapBodyValue}>20%</Text>
                  <Text style={pageStyles.recapBodyValue}>{currencyFormatter((quotation.totalAmountHT! + quotation.shippingServicePrice) * 0.2)}</Text>
                </View>
                <View style={pageStyles.recapFooter}>
                  <Text style={pageStyles.recapFooterText}>Total TTC</Text>
                  <Text style={pageStyles.recapFooterValue}>{currencyFormatter(quotation.totalAmount ?? 0)}</Text>
                </View>
              </View>
            </View>
          )}
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
