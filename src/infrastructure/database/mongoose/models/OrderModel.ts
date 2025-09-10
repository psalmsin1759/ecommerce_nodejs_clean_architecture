import mongoose, { Schema, Document } from "mongoose";

interface OrderDoc extends Document {
  id: string;
  userId: string;
  orderDate: Date;
  status: string;
  items: any[];
  customer: any;
  billingAddress: any;
  shippingAddress: any;
  payment: any;
  shipping?: any;
  totals: any;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    sku: String,
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    imageUrl: String,
    attributes: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    fullName: String,
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false }
);

const PaymentSchema = new Schema(
  {
    method: String,
    transactionId: String,
    amountPaid: Number,
    currency: String,
    status: String,
  },
  { _id: false }
);

const ShippingSchema = new Schema(
  {
    method: String,
    trackingNumber: String,
    cost: Number,
    estimatedDelivery: String,
    status: String,
  },
  { _id: false }
);

const TotalsSchema = new Schema(
  {
    subtotal: Number,
    discount: Number,
    tax: Number,
    shipping: Number,
    grandTotal: Number,
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDoc>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    orderDate: { type: Date, required: true },
    status: { type: String, required: true },
    items: [OrderItemSchema],
    customer: { type: Schema.Types.Mixed, required: true },
    billingAddress: { type: AddressSchema, required: true },
    shippingAddress: { type: AddressSchema, required: true },
    payment: { type: PaymentSchema, required: true },
    shipping: ShippingSchema,
    totals: { type: TotalsSchema, required: true },
    notes: String,
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<OrderDoc>("Order", OrderSchema);
