import { Schema, model, Document } from "mongoose";

interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

interface ProductAttribute {
  name: string;
  value: string | number | boolean;
  visible?: boolean;
  variation?: boolean;
}

interface ProductVariant {
  sku: string;
  name?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  isInStock: boolean;
  attributes: ProductAttribute[];
  images?: ProductImage[];
}

interface ProductReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ProductDocument extends Document {
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

const ProductImageSchema = new Schema<ProductImage>(
  {
    url: { type: String, required: true },
    alt: String,
    isPrimary: Boolean,
  },
  { _id: false }
);

const ProductAttributeSchema = new Schema<ProductAttribute>(
  {
    name: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    visible: Boolean,
    variation: Boolean,
  },
  { _id: false }
);

const ProductVariantSchema = new Schema<ProductVariant>(
  {
    sku: { type: String, required: true },
    name: String,
    price: { type: Number, required: true },
    salePrice: Number,
    stockQuantity: { type: Number, required: true },
    isInStock: { type: Boolean, required: true },
    attributes: [ProductAttributeSchema],
    images: [ProductImageSchema],
  },
  { _id: false }
);

const ProductReviewSchema = new Schema<ProductReview>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ProductSchema = new Schema<ProductDocument>(
  {
    sku: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: String,
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],

    price: { type: Number, required: true },
    salePrice: Number,
    discountPercentage: Number,

    stockQuantity: { type: Number, required: true },
    isInStock: { type: Boolean, required: true },

    variants: [ProductVariantSchema],
    attributes: [ProductAttributeSchema],
    images: [ProductImageSchema],

    averageRating: Number,
    reviewCount: Number,
    reviews: [ProductReviewSchema],

    isFeatured: Boolean,
    isPublished: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const ProductModel = model<ProductDocument>("Product", ProductSchema);
