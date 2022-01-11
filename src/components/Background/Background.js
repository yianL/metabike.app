import { ReactComponent as StravaLogo } from '../../images/api_logo_pwrdBy_strava_stack_gray.svg';
import { ReactComponent as BikeLogo } from '../../images/pedal_bike_black_48dp.svg';
import styles from './Background.module.css';

function Background() {
  return (
    <div className={styles.Background}>
      <div className={styles.Brand}>
        <div>Metabike.</div>
        <div className={styles.StravaLogo}>
          <StravaLogo />
        </div>
      </div>
      <div className={styles.BikeLogo}>
        <BikeLogo />
      </div>
    </div>
  );
}

export default Background;
