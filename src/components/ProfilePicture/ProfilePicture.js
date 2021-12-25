import styles from './ProfilePicture.module.css';

function ProfilePicture({ src }) {
  const realSrc = src || `${process.env.PUBLIC_URL}/images/user.png`;
  const defaultPic = !src;

  return (
    <div className={styles.ProfilePicture}>
      <img
        className={defaultPic ? styles.Default : ''}
        src={realSrc}
        alt="profile_picture"
      />
    </div>
  );
}

export default ProfilePicture;
