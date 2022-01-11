import { ReactComponent as StravaButton } from '../../images/btn_strava_connectwith_light.svg';
import Avatar from '../Avatar';
import { DistanceMetric, ElevationMetric } from '../Metric';
import Card from '../Card';
import Toggle from '../Toggle';
import Spinner from '../Spinner';
import styles from './Hero.module.css';

function Hero(props) {
  const { profile, onUnitChange, unit } = props;

  if (!profile) {
    return <DefaultHero />;
  }

  const { firstname, lastname, avatar, summary, syncStatus } = profile;
  const {
    totalDistanceMeters,
    totalElevationGainMeters,
    totalVirtualDistanceMeters,
    totalVirtualElevationGainMeters,
  } = summary;
  const showImperial = unit === 'mi';

  return (
    <Card className={styles.Hero}>
      <div className={styles.Header}>
        <div>
          <h1>{firstname}</h1>
          <h1>{lastname}</h1>
        </div>
        <Avatar className={styles.Avatar} src={avatar} />
      </div>
      <hr />
      {syncStatus.status === 'PendingInitialSync' ? (
        <div className={styles.Center}>
          <p>
            Fetching data from Strava and crunching numbers for the first time.
          </p>
          <p>This may take a while. The page will refresh automatically.</p>
          <Spinner />
        </div>
      ) : (
        <div>
          <div className={styles.Toggle}>
            <Toggle value={unit} onChange={onUnitChange} />
          </div>
          <DistanceMetric
            title="Total distance"
            showImperial={showImperial}
            baseValueMeters={totalDistanceMeters}
            valueMeters={totalVirtualDistanceMeters}
          />
          <ElevationMetric
            title="Total elevation gain"
            showImperial={showImperial}
            baseValueMeters={totalElevationGainMeters}
            valueMeters={totalVirtualElevationGainMeters}
          />
        </div>
      )}
    </Card>
  );
}

function DefaultHero() {
  return (
    <Card className={styles.Hero}>
      <div className={styles.DefaultHeroContainer}>
        <Avatar />
        <h1>See how far you've biked in the virtual world!</h1>
        <div className={styles.LinkStrava}>
          <a href="/login/federated/strava" role="button">
            <StravaButton className={styles.StravaButton} />
          </a>
          <div className={styles.Start}>
            <span>Link your Strava profile to get started.</span>
            <div id="finger">👆</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Hero;
