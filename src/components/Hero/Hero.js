import { ReactComponent as StravaButton } from '../../images/btn_strava_connectwith_orange.svg';
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
      <div className={styles.ProfilePic}>
        <img
          src="https://dgalywyr863hv.cloudfront.net/pictures/athletes/32534779/9702793/3/large.jpg"
          alt="profile_picture"
        />
      </div>
      <div>
        <p>See how far you've biked in the virtual world!</p>
        <a href="#">
          <StravaButton className={styles.StravaButton} />
        </a>
        <p>Link your Strava profile to get started.👆</p>
      </div>
    </Card>
  );
}

export default Hero;
