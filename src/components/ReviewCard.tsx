import React from 'react';
import { ReviewCardProps } from '../data/types';
import CustomerAvatar from './CustomerAvatar';
import StarRating from './StarRating';
import './ReviewCard.css';

class ReviewCard extends React.Component<ReviewCardProps> {
  render() {
    const { review, isVisible } = this.props;

    return (
      <div 
        className={`review-card ${isVisible ? 'review-card-visible' : 'review-card-hidden'}`}
        role="article"
        aria-label={`Review by ${review.name}`}
      >
        <div className="review-card-header">
          <CustomerAvatar name={review.name} size={60} />
          <div className="review-card-info">
            <h3 className="review-card-name">{review.name}</h3>
            <p className="review-card-designation">{review.designation}</p>
            <StarRating rating={review.rating} />
          </div>
        </div>
        
        <div className="review-card-content">
          <blockquote className="review-card-text">
            "{review.text}"
          </blockquote>
        </div>
        
        <div className="review-card-footer">
          <div className="review-quote-icon">
            <span aria-hidden="true">"</span>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewCard;