import ComponentNetworkReview from './ComponentNetworkReview';
import './index.css';

// Export the main component for Module Federation
export default ComponentNetworkReview;

// Also export as named export for flexibility
export { ComponentNetworkReview };

// Export other components for potential reuse
export { default as ReviewCard } from './components/ReviewCard';
export { default as StarRating } from './components/StarRating';
export { default as CustomerAvatar } from './components/CustomerAvatar';

// Export types for external use
export type {
  Review,
  NetworkReviewState,
  NetworkReviewProps,
  StarRatingProps,
  CustomerAvatarProps,
  ReviewCardProps
} from './data/types';

// Export data utilities
export { getReviews, getReviewById, getTotalReviews } from './data/reviewData';

// Export utility classes
export { ReviewRotationManager, createRotationManager } from './utils/reviewRotation';
export { AnimationManager, createAnimationManager } from './utils/animations';