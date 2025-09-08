import { Schema, model, Document } from "mongoose";

export interface CategoryDoc extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<CategoryDoc>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const CategoryModel = model<CategoryDoc>("Category", CategorySchema);
