export interface Product {
  id: string;
  sku: string;
  slug: string;

  name: string;
  description: string;
  shortDescription?: string;
  categories: string[];

  price: number;
  salePrice?: number;
  discountPercentage?: number;

  stockQuantity: number;
  isInStock: boolean;

  variants?: ProductVariant[];
  attributes?: ProductAttribute[];

  images: ProductImage[];


  averageRating?: number;
  reviewCount?: number;
  reviews?: ProductReview[];

  isFeatured?: boolean;
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  isInStock: boolean;
  attributes: ProductAttribute[];
  images?: ProductImage[];
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string | number | boolean;
  visible?: boolean;
  variation?: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; 
  comment: string;
  createdAt: Date;
}
