import { Order } from "../entities/Order";

export interface OrderFilter {
  status?: string;
  userId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface GraphPoint {
  month: string;
  count: number;
  total: number;
}

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(id: string, update: Partial<Order>): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: OrderFilter): Promise<{ items: Order[]; total: number }>;

  countByDate(
    truncateTo: "day" | "week" | "month" | "year",
  ): Promise<{  count: number }>;
  totalByDate(
    truncateTo: "day" | "week" | "month" | "year",
  ): Promise<{ total: number }>;
  graphData(): Promise<GraphPoint[]>;
}
