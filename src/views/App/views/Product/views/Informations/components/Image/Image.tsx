import CardComponent from '../../../../../../../../components/Card/Card';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import styles from './Image.module.scss';

type AppViewProductViewInformationsViewImageComponentProps = Readonly<{
  product: ProductResponseDto;
}>;
export default function AppViewProductViewInformationsViewImageComponent({ product }: AppViewProductViewInformationsViewImageComponentProps) {
  return (
    <CardComponent title="Image">
      <img src={`https://bd.vizeo.eu/6-Photos/${product.reference}/${product.reference}.jpg`} alt={product.reference ?? undefined} className={styles.image} />
    </CardComponent>
  );
}
