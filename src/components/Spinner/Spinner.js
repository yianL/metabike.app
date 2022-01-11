import styles from './Spinner.module.css';

function Spinner() {
  return (
    <div className={styles.Spinner}>
      <div className={styles.Rect}></div>
      <div className={styles.Rect}></div>
      <div className={styles.Rect}></div>
      <div className={styles.Rect}></div>
      <div className={styles.Rect}></div>
    </div>
  );
}

export default Spinner;
