import { PDFViewer } from '@react-pdf/renderer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useContext, useMemo } from 'react';
import ReactModal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { createBusinessCredit } from '../../../../../../../../utils/api/businessBill';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import BillType from '../../../../../../../../utils/enums/BillType';
import BusinessType from '../../../../../../../../utils/enums/BusinessType';
import { CreditContext } from '../../utils/contexts/context';
import AppViewToolsViewCreditsViewShowModalViewPdfComponent from './components/Pdf/Pdf';
import styles from './ShowModal.module.scss';

const routeApi = getRouteApi('/app/tools/credit/show');

export default function AppViewToolsViewCreditViewShowModalView() {
  const queryClient = useQueryClient();
  const navigate = routeApi.useNavigate();

  const { details, business, shippingServicePrice, items, enterprise, bill } = useContext(CreditContext)!;

  const onClose = () => {
    navigate({ to: '..', search: true, replace: true, resetScroll: false });
  };

  const totalAmountHT = useMemo(() => items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0), [items]);
  const ecoTax = useMemo(() => items.reduce((acc, curr) => acc + (curr.detail.taxDEEE ?? 0), 0), [items]);
  const vat = useMemo(() => (totalAmountHT + ecoTax + shippingServicePrice) * 0.2, [totalAmountHT, ecoTax, shippingServicePrice]);
  const totalAmount = useMemo(() => totalAmountHT + ecoTax + shippingServicePrice + vat, [totalAmountHT, ecoTax, shippingServicePrice, vat]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!business || !bill) throw new Error(`Business or bill is not defined : business:${business}, bill:${bill}`);
      return createBusinessCredit({
        numBusiness: details?.billNumBusiness || business.numBusiness,
        numOrder: bill.billNumberOrder,
        type: BillType.AVOIR,
        shippingServicePrice: shippingServicePrice,
        numBill: bill.number,
        vat: vat,
        totalAmount: totalAmount,
        totalAmountHT: totalAmountHT,
        businessId: business.id,
        detailsDtoList: items.map((item) => ({
          numDetails: item.detail.numDetails,
          numBill: bill.number,
          numCreditNotes: '',
          numBusiness: details?.billNumBusiness || business.numBusiness,
          productId: item.detail.productId,
          productReference: item.detail.productReference,
          quantityBill: item.quantity,
          quantity: item.quantity,
          productDesignation: item.detail.productDesignation,
          productDescription: item.detail.productDescription,
          productName: item.detail.productName,
          publicUnitPrice: item.detail.publicUnitPrice,
          reduction: item.detail.reduction,
          unitPrice: item.price,
          totalPriceBill: item.detail.totalPrice,
          totalPrice: Number(item.quantity) * Number(item.price),
          taxDEEE: item.detail.taxDEEE,
        })),
        businessDto: {
          title: 'Avoir',
          billingAddressOne: business.billingAddressOne,
          billingDepartmentCode: business.billingDepartmentCode,
          deliveryDepartmentCode: details?.deliveryAddressZipCode?.slice(0, 2),
          billingAddressTwo: business.billingAddressTwo,
          billingZipCode: business.billingZipCode ?? '',
          billingCity: business.billingCity,
          billingPhoneNumber: business.billingPhoneNumber,
          billingEmail: business.billingEmail,
          billingCompany: business.billingCompany ?? '',
          enterpriseId: business.enterpriseId,
          enterpriseName: business.enterpriseName,
          enterpriseCategory: business.enterpriseCategory,
          representativeId: business.representativeId,
          representativeName: business.representativeName,
          representativeZipCode: business.representativeZipCode,
          profileId: details?.billingContact?.id,
          profileName: details?.billingContact?.lastName + ' ' + details?.billingContact?.firstName,
          profileEmail: details?.billingContact?.email,
          profilePhone: details?.billingContact?.phoneNumber,
          deliverAddressOne: details?.deliveryAddressOne,
          deliverAddressTwo: details?.deliveryAddressTwo,
          deliverAddressZipCode: details?.deliveryAddressZipCode,
          deliverAddressCity: details?.deliveryAddressCity,
          deliverAddressCompany: details?.deliveryAddressCompanyName,
          deliverAddressName: details?.deliveryAddressFullName,
          deliverPhoneNumber: details?.deliveryAddressPhoneNumber,
          deliverEmail: details?.deliveryAddressEmail,
          documentName: 'ARC',
          type: BusinessType.INTRAVEO,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queries['business-bills']._def });
      toast.success(`Avoir ${data.number} créée sur la facture ${data.numBill} de l'affaire ${data.numBusiness}`);
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la création de l'avoir");
    },
  });

  return (
    <ReactModal isOpen={true} onRequestClose={onClose} className={styles.modal} overlayClassName="Overlay">
      <div className={styles.modal_container}>
        <div className={styles.modal_title}>
          <h6>Votre Avoir :</h6>
        </div>
        <div className={styles.modal_pdfviewer}>
          <PDFViewer showToolbar={false}>
            <AppViewToolsViewCreditsViewShowModalViewPdfComponent
              business={business}
              enterprise={enterprise}
              bill={bill}
              totalAmountHT={totalAmountHT}
              ecoTax={ecoTax}
              vat={vat}
              totalAmount={totalAmount}
              items={items}
              shippingServicePrice={shippingServicePrice}
              details={details}
            />
          </PDFViewer>
        </div>
        <div className={styles.modal_loader}>
          <ClipLoader color="#16204E" loading={isPending} className="" size={35} speedMultiplier={0.8} />
        </div>
        <div className={styles.modal_footer}>
          <button className="btn btn-primary" onClick={onClose}>
            Modifier
          </button>
          <button className="btn btn-secondary" onClick={() => mutate()}>
            Valider
          </button>
        </div>
      </div>
    </ReactModal>
  );
}
