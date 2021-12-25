import { ReactComponent as BikeLogo } from '../../images/pedal_bike_black_48dp.svg';

import styles from './Logo.module.css';

function Logo() {
  return (
    <div className={styles.Logo}>
      <BikeLogo />
      <div id="m">M</div>
    </div>
  );
}

export default Logo;
