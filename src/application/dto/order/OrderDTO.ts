export interface OrderItemDTO {
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

export interface CreateOrderDTO {
  id?: string; 
  userId: string;
  orderDate?: string;
  status?: string;
  items: OrderItemDTO[];
  customer: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  billingAddress: Record<string, any>;
  shippingAddress: Record<string, any>;
  payment: {
    method: string;
    transactionId?: string;
    amountPaid: number;
    currency: string;
    status: string;
  };
  shipping?: any;
  totals: {
    subtotal: number;
    discount?: number;
    tax?: number;
    shipping?: number;
    grandTotal: number;
  };
  notes?: string | undefined;
}

export interface UpdateOrderDTO {
  status?: string;
  payment?: Partial<CreateOrderDTO["payment"]>;
  shipping?: Partial<CreateOrderDTO["shipping"]>;
  notes?: string;
}

export interface AnalyticsRequestDTO {
  from?: string; 
  to?: string; 
  truncateTo: "day" | "week" | "month" | "year";
}

export interface AnalyticsResponseDTO {
  counts: { period: string; count: number }[];
  totals: { period: string; total: number }[];
  graph: { period: string; total: number }[];
}
