import { ReactComponent as StravaButton } from '../../images/btn_strava_connectwith_light.svg';
import Avatar from '../Avatar';
import Card from '../Card';
import styles from './Hero.module.css';

function Hero(props) {
  const { profile } = props;

  if (!profile) {
    return <DefaultHero />;
  }

  const { firstname, lastname, avatar } = profile;

  return (
    <Card className={styles.Hero}>
      <div>
        <div>
          <h1>{firstname}</h1>
          <h1>{lastname}</h1>
        </div>
        <Avatar src={avatar} />
        <hr />
        <div>
          <h2>Total / Virtual miles biked</h2>
          <h2>Total / Virtual feet climbed</h2>
        </div>
      </div>
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
