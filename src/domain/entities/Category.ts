export interface Category {
  id: string;
  name?: string;
  slug: string;
  description?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}
