import mongoose, { Schema, Document } from "mongoose";

interface Role {
  id?: string | undefined;
  name: string;
  permissions: string[];
}

interface AdminDoc extends Document {
  id: string;
  username?: string;
  email: string;
  phone?: string;
  fullName?: string;
  passwordHash?: string;
  roles: Role[];
  status: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<Role>(
  {
    id: { type: String },
    name: { type: String, required: true },
    permissions: { type: [String], default: [] },
  },
  { _id: false }
);

const AdminSchema = new Schema<AdminDoc>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    phone: String,
    fullName: String,
    passwordHash: { type: String },
    roles: {
      type: [RoleSchema],
      default: [],
    },
    status: { type: String, default: "active" },
    lastLogin: Date,
  },
  { timestamps: true }
);

export const AdminModel = mongoose.model<AdminDoc>("Admin", AdminSchema);
