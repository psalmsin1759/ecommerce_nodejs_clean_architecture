import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.string(),
  sku: z.string().optional(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  discount: z.number().nonnegative().optional().default(0),
  tax: z.number().nonnegative().optional().default(0),
  subtotal: z.number().nonnegative(),
  imageUrl: z.string().url().optional(),
  attributes: z.record(z.string(), z.any()).optional(),
});

export const AddressSchema = z.object({
  fullName: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string(),
});

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const PaymentSchema = z.object({
  method: z.string(),
  transactionId: z.string().optional(),
  amountPaid: z.number().nonnegative(),
  currency: z.string(),
  status: z.enum(["pending", "paid", "failed", "refunded"]),
});

export const ShippingSchema = z.object({
  method: z.string().optional(),
  trackingNumber: z.string().optional(),
  cost: z.number().nonnegative().optional(),
  estimatedDelivery: z.string().optional(), // ISO date
  status: z.string().optional(),
});

export const TotalsSchema = z.object({
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  shipping: z.number().nonnegative().optional(),
  grandTotal: z.number().nonnegative(),
});

export const CreateOrderValidator = z.object({
  id: z.string().optional(),
  userId: z.string(),
  orderDate: z.string().optional(),
  status: z
    .enum([
      "pending",
      "confirmed",
      "shipped",
      "in_transit",
      "delivered",
      "cancelled",
      "refunded",
    ])
    .optional(),
  items: z.array(OrderItemSchema).min(1),
  customer: CustomerSchema,
  billingAddress: AddressSchema,
  shippingAddress: AddressSchema,
  payment: PaymentSchema,
  shipping: ShippingSchema.optional(),
  totals: TotalsSchema,
  notes: z.string().optional(),
});

export const UpdateOrderValidator = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "shipped",
      "in_transit",
      "delivered",
      "cancelled",
      "refunded",
    ])
    .optional(),
  payment: PaymentSchema.partial().optional(),
  shipping: ShippingSchema.partial().optional(),
  notes: z.string().optional(),
});

export const CancelOrderValidator = z.object({
  reason: z.string().optional(),
});

export const RefundOrderValidator = z.object({
  refundAmount: z.number().nonnegative().optional(),
});

export const AnalyticsValidator = z.object({
  truncateTo: z.enum(["day", "week", "month", "year"]),
  from: z.string().optional(),
  to: z.string().optional(),
});
