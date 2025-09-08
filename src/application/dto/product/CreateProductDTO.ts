export interface ProductVariantDTO {
  sku: string;
  price: number;
  stockQuantity: number;
  isInStock: boolean;
  attributes: ProductAttributeDTO[];
  name?: string | undefined;          
  salePrice?: number | undefined;    
  images?: ProductImageDTO[] | undefined;
}

export interface ProductImageDTO {
  url: string;
  alt?: string | undefined;
  isPrimary?: boolean | undefined;
}

export interface ProductAttributeDTO {
  name: string;
  value: string | number | boolean;
  visible?: boolean | undefined;
  variation?: boolean | undefined;
}

export interface CreateProductDTO {
  sku: string;
  slug: string;
  name: string;
  description: string;
  shortDescription?: string | undefined;
  categories: string[];

  price: number;
  salePrice?: number | undefined;
  discountPercentage?: number | undefined;

  stockQuantity: number;
  isInStock: boolean;

  variants?: ProductVariantDTO[] | undefined;   // ✅ fixed
  attributes?: ProductAttributeDTO[] | undefined;

  images: ProductImageDTO[];

  isFeatured?: boolean | undefined;
  isPublished: boolean;
}
