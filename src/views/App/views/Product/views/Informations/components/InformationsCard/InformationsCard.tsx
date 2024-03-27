import AmountFormat from '../../../../../../../../components/AmountFormat/AmountFormat';
import CardComponent from '../../../../../../../../components/Card/Card';
import CurrencyFormat from '../../../../../../../../components/CurrencyFormat/CurrencyFormat';
import ProductResponseDto from '../../../../../../../../utils/types/ProductResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './InformationsCard.module.scss';

type AppViewProductViewInformationsViewInformationsCardComponentProps = Readonly<{
  product: ProductResponseDto;
}>;
export default function AppViewProductViewInformationsViewInformationsCardComponent({
  product,
}: AppViewProductViewInformationsViewInformationsCardComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  return (
    <CardComponent title="Informations produit">
      <div className={styles.container}>
        <div className={styles.details}>
          <p className={styles.title}>Produit :</p>
          <p className={styles.content}>{product.reference ?? 'Pas de référence'}</p>
        </div>
        <div className={styles.details}>
          <p className={styles.title}>Description :</p>
          <p className={styles.content}>{product.shortDescription}</p>
        </div>
        <div className={styles.details}>
          <p className={styles.title}>Prix public :</p>
          <CurrencyFormat value={product.publicPrice} className={styles.content} />
        </div>
        {!product.virtualQty && (
          <div className={styles.details}>
            <p className={styles.title}>Stocks à ce jour :</p>
            <AmountFormat value={product.qty} className={styles.content} />
          </div>
        )}
        {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
          <div className={styles.details}>
            <p className={styles.title}>Fournisseur :</p>
            <p className={styles.content}>{product.providerName ?? 'Aucun fournisseur'}</p>
          </div>
        )}
      </div>
    </CardComponent>
  );
}
