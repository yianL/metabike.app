import styles from './Card.module.css';

function Card({ className, children }) {
  return <div className={`${styles.Card} ${className}`}>{children}</div>;
}

export default Card;
