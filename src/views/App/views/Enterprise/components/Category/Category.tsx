import CardComponent from '../../../../../../components/Card/Card';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import styles from './Category.module.scss';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import { Link, getRouteApi } from '@tanstack/react-router';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

type AppViewEnterpriseViewCategoryComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
}>;
export default function AppViewEnterpriseViewCategoryComponent({ enterprise }: AppViewEnterpriseViewCategoryComponentProps) {
  return (
    <CardComponent title="Catégorie">
      <div className={styles.container}>
        <div className={styles.form_select}>
          <div className={styles.form_group}>
            <select disabled>
              <option>{enterprise.category}</option>
            </select>
          </div>
        </div>

        {![CategoryClient.VIZEO, CategoryClient.FOURNISSEUR, CategoryClient.REPRESENTANT].includes(enterprise.category) && (
          <div className={styles.submit_button}>
            <Link from={Route.id} to="./update-category" search={(old) => old} replace resetScroll={false} className="btn btn-primary">
              Modifier
            </Link>
          </div>
        )}
      </div>
    </CardComponent>
  );
}
