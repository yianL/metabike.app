import ReactTooltip from 'react-tooltip';
import cn from 'classnames';
import styles from './Metric.module.css';

const meterToMile = (m) => (m / 1000) * 0.621;
const meterToKm = (m) => m / 1000;
const meterToFeet = (m) => m * 3.28;

export function PortionMetric({ className, title, baseValue, value, unit }) {
  const percentile = Math.round((value / baseValue) * 100);

  return (
    <div className={cn(styles.Metric, className)}>
      <div className={styles.Title}>
        <h2>{title}</h2>
        <span>
          {`${baseValue.toLocaleString()} (${value.toLocaleString()})`}
          <b data-type="unit">{unit}</b>
        </span>
      </div>
      <div className={styles.BarBackground}>
        <div
          className={styles.Bar}
          style={{ width: `${Math.max(1, percentile)}%` }}
          data-tip={`${percentile}%`}
        />
      </div>
      <ReactTooltip />
    </div>
  );
}

export function SimpleMetric({ className, title, value, unit }) {
  return (
    <div className={cn(styles.Metric, className)}>
      <div className={styles.Title}>
        <h2>{title}</h2>
        <span>
          {value.toLocaleString()}
          <b data-type="unit">{unit}</b>
        </span>
      </div>
    </div>
  );
}

export function DurationMetric({ className, title, valueSeconds }) {
  let base = valueSeconds;
  const seconds = base % 60;
  base = Math.floor(base / 60);
  const minutes = base % 60;
  base = Math.floor(base / 60);
  const hours = base;

  return (
    <div className={cn(styles.Metric, className)}>
      <div className={styles.Title}>
        <h2>{title}</h2>
        {hours > 0 && (
          <span>
            {hours.toLocaleString()}
            <b data-type="unit">h</b>
          </span>
        )}
        {hours > 0 && (
          <span>
            {minutes}
            <b data-type="unit">m</b>
          </span>
        )}
        {hours > 0 && (
          <span>
            {seconds}
            <b data-type="unit">s</b>
          </span>
        )}
      </div>
    </div>
  );
}

export function DistanceMetric({
  className,
  title,
  showImperial,
  baseValueMeters,
  valueMeters,
}) {
  const baseValue = showImperial
    ? meterToMile(baseValueMeters)
    : meterToKm(baseValueMeters);
  const value = showImperial
    ? meterToMile(valueMeters)
    : meterToKm(valueMeters);
  const unit = showImperial ? 'mi' : 'km';

  return (
    <PortionMetric
      className={className}
      title={title}
      baseValue={Number.parseFloat(baseValue.toFixed(1))}
      value={Number.parseFloat(value.toFixed(1))}
      unit={unit}
    />
  );
}

export function ElevationMetric({
  className,
  title,
  showImperial,
  baseValueMeters,
  valueMeters,
}) {
  const baseValue = showImperial
    ? meterToFeet(baseValueMeters)
    : baseValueMeters;
  const value = showImperial ? meterToFeet(valueMeters) : valueMeters;
  const unit = showImperial ? 'ft' : 'm';

  return (
    <PortionMetric
      className={className}
      title={title}
      baseValue={Number.parseFloat(baseValue.toFixed(1))}
      value={Number.parseFloat(value.toFixed(1))}
      unit={unit}
    />
  );
}
