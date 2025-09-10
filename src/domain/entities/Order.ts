export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  sku?: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
  tax?: number;
  subtotal: number;
  imageUrl?: string;
  attributes?: Record<string, any>;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Payment {
  method: string;
  transactionId?: string;
  amountPaid: number;
  currency: string;
  status: PaymentStatus;
}

export interface Shipping {
  method?: string;
  trackingNumber?: string;
  cost?: number;
  estimatedDelivery?: string;
  status?: string;
}

export interface Totals {
  subtotal: number;
  discount?: number;
  tax?: number;
  shipping?: number;
  grandTotal: number;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  status: OrderStatus;
  items: OrderItem[];
  customer: Customer;
  billingAddress: Address;
  shippingAddress: Address;
  payment: Payment;
  shipping?: Shipping;
  totals: Totals;
  notes?: string | undefined;
  createdAt?: string;
  updatedAt?: string;
}
