import cn from 'classnames';
import styles from './Toggle.module.css';

function Toggle({ onChange, value }) {
  return (
    <div className={cn(styles.Toggle)}>
      <div className={styles.button}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={value === 'mi'}
          onChange={onChange}
        />
        <div className={styles.knobs}>
          <span>km</span>
        </div>
        <div className={styles.layer}></div>
      </div>
    </div>
  );
}

export default Toggle;
