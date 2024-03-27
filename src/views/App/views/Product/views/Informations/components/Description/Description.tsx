import CardComponent from '../../../../../../../../components/Card/Card';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import styles from './Description.module.scss';

type AppViewProductViewInformationsViewDescriptionComponentProps = Readonly<{
  product: ProductResponseDto;
}>;
export default function AppViewProductViewInformationsViewDescriptionComponent({ product }: AppViewProductViewInformationsViewDescriptionComponentProps) {
  return (
    <CardComponent title="Description">
      <div className={styles.description}>{product.description ?? 'Aucune description'}</div>
    </CardComponent>
  );
}
