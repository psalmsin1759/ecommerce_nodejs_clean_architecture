import { ProductVariantDTO, ProductImageDTO, ProductAttributeDTO } from "./CreateProductDTO";

export interface UpdateProductDTO {
  sku?: string | undefined;
  slug?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  shortDescription?: string | undefined;
  categories?: string[] | undefined;

  price?: number | undefined;
  salePrice?: number | undefined;
  discountPercentage?: number | undefined;

  stockQuantity?: number | undefined;
  isInStock?: boolean | undefined;

  variants?: ProductVariantDTO[] | undefined;
  attributes?: ProductAttributeDTO[] | undefined;

  images?: ProductImageDTO[] | undefined;

  isFeatured?: boolean | undefined;
  isPublished?: boolean | undefined;
}
