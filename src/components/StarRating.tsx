import React from 'react';
import { StarRatingProps } from '../data/types';
import './StarRating.css';

class StarRating extends React.Component<StarRatingProps> {
  // Render individual star
  private renderStar = (index: number, filled: boolean): JSX.Element => {
    return (
      <span
        key={index}
        className={`star ${filled ? 'star-filled' : 'star-empty'}`}
        aria-hidden="true"
      >
        ★
      </span>
    );
  };

  render() {
    const { rating, maxStars = 5 } = this.props;
    const stars: JSX.Element[] = [];

    // Create array of stars
    for (let i = 1; i <= maxStars; i++) {
      const filled = i <= rating;
      stars.push(this.renderStar(i, filled));
    }

    return (
      <div 
        className="star-rating"
        role="img"
        aria-label={`${rating} out of ${maxStars} stars`}
        title={`${rating}/${maxStars} stars`}
      >
        {stars}
        <span className="rating-text">
          {rating}/{maxStars}
        </span>
      </div>
    );
  }
}

export default StarRating;