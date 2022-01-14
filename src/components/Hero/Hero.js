import cn from 'classnames';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as StravaButton } from '../../images/btn_strava_connectwith_light.svg';
import Avatar from '../Avatar';
import { DistanceMetric, ElevationMetric } from '../Metric';
import Card from '../Card';
import Toggle from '../Toggle';
import Spinner from '../Spinner';
import styles from './Hero.module.css';
import moment from 'moment';

function Hero(props) {
  const { profile, onUnitChange, onStartSync, unit } = props;

  if (!profile) {
    return <DefaultHero />;
  }

  const { firstname, lastname, avatar, summary, syncStatus, updatedAt } =
    profile;
  const {
    totalDistanceMeters,
    totalElevationGainMeters,
    totalVirtualDistanceMeters,
    totalVirtualElevationGainMeters,
  } = summary;
  const showImperial = unit === 'mi';
  const lastUpdated = moment
    .duration(moment.now() - updatedAt * 1000)
    .humanize();
  const lastUpdatedDate = moment(updatedAt * 1000).format(
    'MMM Do YYYY, h:mm:ssa'
  );

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
          <div className={styles.Actions}>
            <button
              className={styles.Button}
              onClick={onStartSync}
              disabled={syncStatus.status === 'Syncing'}
            >
              <span
                className={cn('material-icons', {
                  spin: syncStatus.status === 'Syncing',
                })}
              >
                sync
              </span>
              Sync
            </button>
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
      <div className={styles.Footer}>
        <b>Last Updated: </b>
        <span data-tip={lastUpdatedDate}>{`${lastUpdated} ago`}</span>
      </div>
      <ReactTooltip />
    </Card>
  );
}

function DefaultHero() {
  return (
    <Card className={styles.Hero}>
      <div className={styles.DefaultHeroContainer}>
        <Avatar />
        <h1>
          See how far you've biked in the virtual world <br />& more interesting
          stats PER BIKE!
        </h1>
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
