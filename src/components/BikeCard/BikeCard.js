import cn from 'classnames';
import Card from '../Card';
import { DistanceMetric, ElevationMetric } from '../Metric';
import { ReactComponent as BikeLogo } from '../../images/pedal_bike_black_48dp.svg';
import styles from './BikeCard.module.css';

function BikeAvatar({ primary }) {
  return (
    <div className={cn(styles.Avatar, { [styles.Primary]: primary })}>
      <BikeLogo />
    </div>
  );
}

function BikeCard({ bike, showImperial }) {
  const {
    name,
    totalDistanceMeters,
    totalElevationGainMeters,
    virtualDistanceMeters,
    virtualElevationGainMeters,
    primary,
  } = bike;
  return (
    <Card className={styles.BikeCard}>
      <BikeAvatar primary={primary} />
      <div>
        <h1>{name}</h1>
        <hr />
        <DistanceMetric
          title="Total distance"
          showImperial={showImperial}
          baseValueMeters={totalDistanceMeters}
          valueMeters={virtualDistanceMeters}
        />
        <ElevationMetric
          title="Total elevation gain"
          showImperial={showImperial}
          baseValueMeters={totalElevationGainMeters}
          valueMeters={virtualElevationGainMeters}
        />
      </div>
    </Card>
  );
}

export default BikeCard;
