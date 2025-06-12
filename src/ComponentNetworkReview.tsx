import React from 'react';
import { NetworkReviewState, NetworkReviewProps } from './data/types';
import { getReviews } from './data/reviewData';
import { ReviewRotationManager } from './utils/reviewRotation';
import ReviewCard from './components/ReviewCard';
import './ComponentNetworkReview.css';

class ComponentNetworkReview extends React.Component<NetworkReviewProps, NetworkReviewState> {
  private rotationManager: ReviewRotationManager | null = null;

  constructor(props: NetworkReviewProps) {
    super(props);
    
    const reviews = getReviews();
    this.state = {
      currentReviewIndex: 0,
      isTransitioning: false,
      reviews: reviews
    };
  }

  componentDidMount() {
    this.initializeRotation();
  }

  componentWillUnmount() {
    this.cleanupRotation();
  }

  // Initialize the review rotation
  private initializeRotation = (): void => {
    if (this.state.reviews.length > 1) {
      this.rotationManager = new ReviewRotationManager(
        this.state.reviews.length,
        this.handleRotation,
        10000 // 10 seconds
      );
      this.rotationManager.start();
    }
  };

  // Cleanup rotation manager
  private cleanupRotation = (): void => {
    if (this.rotationManager) {
      this.rotationManager.stop();
      this.rotationManager = null;
    }
  };

  // Handle rotation to next review
  private handleRotation = (newIndex: number): void => {
    this.setState({
      isTransitioning: true
    });

    // Add a small delay for smooth transition
    setTimeout(() => {
      this.setState({
        currentReviewIndex: newIndex,
        isTransitioning: false
      });
    }, 250);
  };

  // Handle manual navigation (for future enhancement)
  private goToReview = (index: number): void => {
    if (this.rotationManager && index !== this.state.currentReviewIndex) {
      this.rotationManager.goToReview(index);
    }
  };

  // Pause rotation on hover (optional feature)
  private handleMouseEnter = (): void => {
    if (this.rotationManager) {
      this.rotationManager.stop();
    }
  };

  // Resume rotation on mouse leave (optional feature)
  private handleMouseLeave = (): void => {
    if (this.rotationManager) {
      this.rotationManager.start();
    }
  };

  render() {
    const { currentReviewIndex, isTransitioning, reviews } = this.state;

    if (reviews.length === 0) {
      return (
        <div className="network-review-container">
          <div className="network-review-error">
            <p>No reviews available</p>
          </div>
        </div>
      );
    }

    const currentReview = reviews[currentReviewIndex];

    return (
      <div 
        className="network-review-container"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        role="region"
        aria-label="Customer Reviews"
      >
        <div className="network-review-header">
          <h2 className="network-review-title">Customer Reviews!</h2>
          <div className="network-review-indicators">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`review-indicator ${index === currentReviewIndex ? 'active' : ''}`}
                onClick={() => this.goToReview(index)}
                aria-label={`Go to review ${index + 1}`}
                title={`Review ${index + 1} of ${reviews.length}`}
              />
            ))}
          </div>
        </div>

        <div className="network-review-content">
          <ReviewCard
            review={currentReview}
            isVisible={!isTransitioning}
          />
        </div>

        <div className="network-review-footer">
          <div className="review-counter">
            {currentReviewIndex + 1} of {reviews.length}
          </div>
        </div>
      </div>
    );
  }
}

export default ComponentNetworkReview;