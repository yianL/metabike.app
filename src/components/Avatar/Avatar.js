import cn from 'classnames';
import styles from './Avatar.module.css';

function Avatar({ src, className }) {
  const realSrc = src || `${process.env.PUBLIC_URL}/images/user.png`;
  const defaultPic = !src;

  return (
    <div className={cn(styles.Avatar, className)}>
      <img
        className={defaultPic ? styles.Default : ''}
        src={realSrc}
        alt="profile_picture"
      />
    </div>
  );
}

export default Avatar;
