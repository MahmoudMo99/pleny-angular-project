// Defining an interface for a product object
export interface IProducts {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: IDimesions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: IReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  images: string[];
}
// Defining an interface for the dimensions of a product
export interface IDimesions {
  width: number;
  height: number;
  depth: number;
}
// Defining an interface for a product review
export interface IReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}
