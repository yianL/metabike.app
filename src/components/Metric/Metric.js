import ReactTooltip from 'react-tooltip';
import styles from './Metric.module.css';

const meterToMile = (m) => (m / 1000) * 0.621;
const meterToKm = (m) => (m / 1000) * 0.621;
const meterToFeet = (m) => m * 3.28;

export function Metric({ className, title, baseValue, value, unit }) {
  const percentile = Math.round((value / baseValue) * 100);

  return (
    <div className={`${styles.Metric} ${className}`}>
      <h2>{title}</h2>
      <span>{`${baseValue.toLocaleString()} (${value.toLocaleString()}) ${unit}`}</span>
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
    <Metric
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
    <Metric
      className={className}
      title={title}
      baseValue={Number.parseFloat(baseValue.toFixed(1))}
      value={Number.parseFloat(value.toFixed(1))}
      unit={unit}
    />
  );
}
