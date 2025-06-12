import { Review } from './types';

// Sample review data for the NetworkReview plugin
export const reviewData: Review[] = [
  {
    id: 1,
    name: "John Smith",
    designation: "Client Designation",
    rating: 4,
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  },
  {
    id: 2,
    name: "Sarah Johnson",
    designation: "Customer",
    rating: 5,
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
  },
  {
    id: 3,
    name: "David Chen",
    designation: "Business Owner",
    rating: 4,
    text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati."
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    designation: "Manager",
    rating: 5,
    text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro."
  },
  {
    id: 5,
    name: "Alex Thompson",
    designation: "Developer",
    rating: 4,
    text: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam."
  }
];

// Utility function to get reviews
export const getReviews = (): Review[] => {
  return reviewData;
};

// Utility function to get a specific review by ID
export const getReviewById = (id: number): Review | undefined => {
  return reviewData.find(review => review.id === id);
};

// Utility function to get total number of reviews
export const getTotalReviews = (): number => {
  return reviewData.length;
};