import { Order } from "../entities/Order";

export interface OrderFilter {
  
  status?: "pending" | "confirmed" | "shipped" | "in_transit" | "delivered" | "cancelled" | "refunded" | undefined;

  paymentStatus?: "pending" | "paid" | "failed" | "refunded" | undefined;

  shippingStatus?: string | undefined;

  userId?: string | undefined;
  customerEmail?: string | undefined;
  customerPhone?: string | undefined;


  from?: string | undefined; 
  to?: string | undefined;   // ISO date string

  // Search filter (orderId, SKU, customer name, etc.)
  search?: string | undefined;


  page?: number | undefined;
  limit?: number | undefined;

  sortBy?: "orderDate" | "total" | "status" | "paymentStatus" | undefined;
  sortOrder?: "asc" | "desc" | undefined;
}


export interface GraphPoint {
  month: string;
  count: number;
  total: number;
}

export interface TopSalesValue {
  name: string;
  count: number
}

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(id: string, update: Partial<Order>): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: OrderFilter): Promise<{
    items: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>;

  countByDate(
    truncateTo: "day" | "week" | "month" | "year"
  ): Promise<{ count: number }>;
  totalByDate(
    truncateTo: "day" | "week" | "month" | "year"
  ): Promise<{ total: number }>;
  graphData(): Promise<GraphPoint[]>;

  topSellingProducts(
    truncateTo: "day" | "week" | "month" | "year"
  ): Promise<TopSalesValue[]>;
}
