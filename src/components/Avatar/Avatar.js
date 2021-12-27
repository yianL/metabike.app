import styles from './Avatar.module.css';

function Avatar({ src }) {
  const realSrc = src || `${process.env.PUBLIC_URL}/images/user.png`;
  const defaultPic = !src;

  return (
    <div className={styles.Avatar}>
      <img
        className={defaultPic ? styles.Default : ''}
        src={realSrc}
        alt="profile_picture"
      />
    </div>
  );
}

export default Avatar;
