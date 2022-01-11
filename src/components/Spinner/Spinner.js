import styles from './Spinner.module.css';

function Spinner() {
  return (
    <div class={styles.Spinner}>
      <div class={styles.Rect}></div>
      <div class={styles.Rect}></div>
      <div class={styles.Rect}></div>
      <div class={styles.Rect}></div>
      <div class={styles.Rect}></div>
    </div>
  );
}

export default Spinner;
