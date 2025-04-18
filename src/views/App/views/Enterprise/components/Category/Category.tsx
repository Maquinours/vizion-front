import { Link } from '@tanstack/react-router';
import CardComponent from '../../../../../../components/Card/Card';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import styles from './Category.module.scss';

const routePath = '/app/enterprises/$enterpriseId';

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

        {![CategoryClient.VIZEO, CategoryClient.FOURNISSEUR].includes(enterprise.category) && (
          <div className={styles.submit_button}>
            <Link from={routePath} to="./update-category" search replace resetScroll={false} preload="intent" className="btn btn-primary">
              Modifier
            </Link>
          </div>
        )}
      </div>
    </CardComponent>
  );
}
