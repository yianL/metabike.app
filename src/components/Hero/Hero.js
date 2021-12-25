import { ReactComponent as StravaButton } from '../../images/btn_strava_connectwith_light.svg';
import ProfilePicture from '../ProfilePicture';
import Card from '../Card';
import styles from './Hero.module.css';

function Hero(props) {
  const { profile } = props;

  if (!profile) {
    return <DefaultHero />;
  }

  return <Card></Card>;
}

function DefaultHero() {
  return (
    <Card className={styles.Hero}>
      <div className={styles.DefaultHeroContainer}>
        <ProfilePicture />
        <h1>See how far you've biked in the virtual world!</h1>
        <div className={styles.LinkStrava}>
          <a href="#">
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
