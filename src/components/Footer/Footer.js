import styles from './Footer.module.css';

function Footer() {
  return (
    <div className={styles.Footer}>
      <span>Built with</span>
      <span className="material-icons">favorite_border</span>
      <a href="https://yian.dev">yian.dev</a>
    </div>
  );
}

export default Footer;
