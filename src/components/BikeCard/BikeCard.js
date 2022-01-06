import cn from 'classnames';
import Card from '../Card';
import {
  DistanceMetric,
  DurationMetric,
  ElevationMetric,
  SimpleMetric,
} from '../Metric';
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
    totalKudos,
    totalPRSmashed,
    totalTimeOnBikeSeconds,
    primary,
    retired,
  } = bike;
  return (
    <Card className={styles.BikeCard}>
      <BikeAvatar primary={primary} />
      <div>
        <h1>
          {name}
          {primary && <span data-type="tag">[primary]</span>}
          {retired && <span data-type="tag">[retired]</span>}
        </h1>
        <hr />
        <DistanceMetric
          title="Distance"
          showImperial={showImperial}
          baseValueMeters={totalDistanceMeters}
          valueMeters={virtualDistanceMeters}
        />
        <ElevationMetric
          title="Elevation gain"
          showImperial={showImperial}
          baseValueMeters={totalElevationGainMeters}
          valueMeters={virtualElevationGainMeters}
        />
        <SimpleMetric title="Kudos obtained" value={totalKudos} />
        <SimpleMetric title="PRs smashed" value={totalPRSmashed} />
        <DurationMetric
          title="Time on bike"
          valueSeconds={totalTimeOnBikeSeconds}
        />
      </div>
    </Card>
  );
}

export default BikeCard;
