import { ReactComponent as StravaLogo } from '../../images/api_logo_pwrdBy_strava_stack_gray.svg';
import styles from './Footer.module.css';

function Footer() {
  return (
    <div className={styles.Footer}>
      <div >
        Metabike.
      </div>
      <div className={styles.StravaLogo}>
        <StravaLogo />
      </div>
    </div>
  );
}

export default Footer;
