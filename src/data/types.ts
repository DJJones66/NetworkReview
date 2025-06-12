// TypeScript interfaces and types for NetworkReview plugin

export interface Review {
  id: number;
  name: string;
  designation: string;
  rating: number; // 1-5 stars
  text: string;
  avatar?: string;
}

export interface NetworkReviewState {
  currentReviewIndex: number;
  isTransitioning: boolean;
  reviews: Review[];
}

export interface NetworkReviewProps {
  // Future props can be added here
}

export interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

export interface CustomerAvatarProps {
  name: string;
  size?: number;
}

export interface ReviewCardProps {
  review: Review;
  isVisible: boolean;
}