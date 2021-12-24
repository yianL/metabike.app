import './BikeCard.css';

function BikeCard() {
  return (
    <div className="BikeCard">
      <div className="ProfilePic">
        <img src="https://dgalywyr863hv.cloudfront.net/pictures/athletes/32534779/9702793/3/large.jpg" alt="profile_picture" />
      </div>
      <div>
        <p>See how far you've biked in the virtual world!</p>
        <p>Link your Strava profile to get started.👆</p>
      </div>
    </div>
  );
}

export default BikeCard;
