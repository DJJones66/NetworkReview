// Utility functions for review rotation logic

export class ReviewRotationManager {
  private timer: any = null;
  private currentIndex: number = 0;
  private totalReviews: number = 0;
  private rotationInterval: number = 10000; // 10 seconds
  private onRotate: (index: number) => void = () => {};

  constructor(totalReviews: number, onRotate: (index: number) => void, interval: number = 10000) {
    this.totalReviews = totalReviews;
    this.onRotate = onRotate;
    this.rotationInterval = interval;
  }

  // Start the rotation timer
  start = (): void => {
    if (this.timer) {
      this.stop();
    }
    
    this.timer = setInterval(() => {
      this.nextReview();
    }, this.rotationInterval);
  };

  // Stop the rotation timer
  stop = (): void => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  // Move to the next review
  nextReview = (): void => {
    this.currentIndex = (this.currentIndex + 1) % this.totalReviews;
    this.onRotate(this.currentIndex);
  };

  // Move to the previous review
  previousReview = (): void => {
    this.currentIndex = this.currentIndex === 0 ? this.totalReviews - 1 : this.currentIndex - 1;
    this.onRotate(this.currentIndex);
  };

  // Go to a specific review
  goToReview = (index: number): void => {
    if (index >= 0 && index < this.totalReviews) {
      this.currentIndex = index;
      this.onRotate(this.currentIndex);
    }
  };

  // Get current review index
  getCurrentIndex = (): number => {
    return this.currentIndex;
  };

  // Reset to first review
  reset = (): void => {
    this.currentIndex = 0;
    this.onRotate(this.currentIndex);
  };

  // Update rotation interval
  setInterval = (interval: number): void => {
    this.rotationInterval = interval;
    if (this.timer) {
      this.stop();
      this.start();
    }
  };

  // Check if rotation is active
  isActive = (): boolean => {
    return this.timer !== null;
  };
}

// Utility function to create a rotation manager
export const createRotationManager = (
  totalReviews: number, 
  onRotate: (index: number) => void, 
  interval: number = 10000
): ReviewRotationManager => {
  return new ReviewRotationManager(totalReviews, onRotate, interval);
};

// Utility function to calculate next index
export const getNextIndex = (currentIndex: number, totalItems: number): number => {
  return (currentIndex + 1) % totalItems;
};

// Utility function to calculate previous index
export const getPreviousIndex = (currentIndex: number, totalItems: number): number => {
  return currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
};