import { ReactComponent as StravaButton } from '../../images/btn_strava_connectwith_light.svg';
import Avatar from '../Avatar';
import { DistanceMetric, ElevationMetric } from '../Metric';
import Card from '../Card';
import styles from './Hero.module.css';

function Hero(props) {
  const { profile } = props;

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
        <div>
          Fetching data from Strava and crunching numbers for the first time.
          This may take a while...
        </div>
      ) : (
        <div>
          <DistanceMetric
            title="Total distance"
            showImperial={false}
            baseValueMeters={totalDistanceMeters}
            valueMeters={totalVirtualDistanceMeters}
          />
          <ElevationMetric
            title="Total elevation gain"
            showImperial={false}
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
