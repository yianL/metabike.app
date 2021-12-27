import Card from '../Card';
import { ReactComponent as BikeLogo } from '../../images/pedal_bike_black_48dp.svg';
import styles from './BikeCard.module.css';

function BikeCard({ bike }) {
  const { name } = bike;
  return (
    <Card className={styles.BikeCard}>
      <div className={styles.Avatar}>
        <BikeLogo />
      </div>
      <div>
        <h2>{name}</h2>
        <hr />
      </div>
    </Card>
  );
}

export default BikeCard;
