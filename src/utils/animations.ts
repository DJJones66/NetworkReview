// Animation and transition helpers for NetworkReview plugin

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export const defaultAnimationConfig: AnimationConfig = {
  duration: 500,
  easing: 'ease-in-out',
  delay: 0
};

// CSS class names for animations
export const animationClasses = {
  fadeIn: 'network-review-fade-in',
  fadeOut: 'network-review-fade-out',
  slideInLeft: 'network-review-slide-in-left',
  slideOutRight: 'network-review-slide-out-right',
  visible: 'network-review-visible',
  hidden: 'network-review-hidden'
};

// Animation utility functions
export class AnimationManager {
  private element: HTMLElement | null = null;

  constructor(element: HTMLElement | null) {
    this.element = element;
  }

  // Apply fade in animation
  fadeIn = (config: AnimationConfig = defaultAnimationConfig): Promise<void> => {
    return new Promise((resolve) => {
      if (!this.element) {
        resolve();
        return;
      }

      this.element.style.transition = `opacity ${config.duration}ms ${config.easing}`;
      this.element.style.opacity = '0';
      
      // Force reflow
      this.element.offsetHeight;
      
      this.element.style.opacity = '1';
      
      setTimeout(() => {
        resolve();
      }, config.duration + (config.delay || 0));
    });
  };

  // Apply fade out animation
  fadeOut = (config: AnimationConfig = defaultAnimationConfig): Promise<void> => {
    return new Promise((resolve) => {
      if (!this.element) {
        resolve();
        return;
      }

      this.element.style.transition = `opacity ${config.duration}ms ${config.easing}`;
      this.element.style.opacity = '1';
      
      // Force reflow
      this.element.offsetHeight;
      
      this.element.style.opacity = '0';
      
      setTimeout(() => {
        resolve();
      }, config.duration + (config.delay || 0));
    });
  };

  // Apply slide transition
  slideTransition = (direction: 'left' | 'right', config: AnimationConfig = defaultAnimationConfig): Promise<void> => {
    return new Promise((resolve) => {
      if (!this.element) {
        resolve();
        return;
      }

      const translateX = direction === 'left' ? '-100%' : '100%';
      
      this.element.style.transition = `transform ${config.duration}ms ${config.easing}`;
      this.element.style.transform = `translateX(${translateX})`;
      
      setTimeout(() => {
        if (this.element) {
          this.element.style.transform = 'translateX(0)';
        }
        resolve();
      }, config.duration + (config.delay || 0));
    });
  };

  // Reset all animations
  reset = (): void => {
    if (this.element) {
      this.element.style.transition = '';
      this.element.style.opacity = '';
      this.element.style.transform = '';
    }
  };
}

// Utility function to create animation manager
export const createAnimationManager = (element: HTMLElement | null): AnimationManager => {
  return new AnimationManager(element);
};

// Utility function to add CSS animation classes
export const addAnimationClass = (element: HTMLElement | null, className: string, duration: number = 500): Promise<void> => {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }

    element.classList.add(className);
    
    setTimeout(() => {
      element.classList.remove(className);
      resolve();
    }, duration);
  });
};

// Utility function to handle smooth transitions between reviews
export const transitionBetweenReviews = async (
  outgoingElement: HTMLElement | null,
  incomingElement: HTMLElement | null,
  config: AnimationConfig = defaultAnimationConfig
): Promise<void> => {
  const outgoingManager = createAnimationManager(outgoingElement);
  const incomingManager = createAnimationManager(incomingElement);

  // Fade out the current review
  if (outgoingElement) {
    await outgoingManager.fadeOut(config);
  }

  // Fade in the new review
  if (incomingElement) {
    await incomingManager.fadeIn(config);
  }
};

// Utility function to get CSS transition string
export const getTransitionString = (config: AnimationConfig): string => {
  return `all ${config.duration}ms ${config.easing}${config.delay ? ` ${config.delay}ms` : ''}`;
};