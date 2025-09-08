import { z } from "zod";

export const ProductAttributeSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean()]),
  visible: z.boolean().optional(),
  variation: z.boolean().optional(),
});

export const ProductImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

export const ProductVariantSchema = z.object({
  sku: z.string(),
  name: z.string().optional(),
  price: z.number().nonnegative(),
  salePrice: z.number().nonnegative().optional(),
  stockQuantity: z.number().int().nonnegative(),
  isInStock: z.boolean(),
  attributes: z.array(ProductAttributeSchema),
  images: z.array(ProductImageSchema).optional(),
});

export const CreateProductSchema = z.object({
  sku: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  shortDescription: z.string().optional(),
  categories: z.array(z.string()),

  price: z.number().nonnegative(),
  salePrice: z.number().nonnegative().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),

  stockQuantity: z.number().int().nonnegative(),
  isInStock: z.boolean(),

  variants: z.array(ProductVariantSchema).optional(),
  attributes: z.array(ProductAttributeSchema).optional(),
  images: z.array(ProductImageSchema),

  isFeatured: z.boolean().optional(),
  isPublished: z.boolean(),
});

export const UpdateProductSchema = CreateProductSchema.partial();
