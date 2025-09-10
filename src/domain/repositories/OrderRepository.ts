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
  period: string;
  value: number;
}

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(id: string, update: Partial<Order>): Promise<Order | null>;
  delete(id: string): Promise<boolean>;
  list(filter?: OrderFilter): Promise<{ items: Order[]; total: number }>;

  countByDate(
    truncateTo: "day" | "week" | "month" | "year",
    from?: string,
    to?: string
  ): Promise<{ period: string; count: number }[]>;
  totalByDate(
    truncateTo: "day" | "week" | "month" | "year",
    from?: string,
    to?: string
  ): Promise<{ period: string; total: number }[]>;
  graphData(
    truncateTo: "day" | "week" | "month" | "year",
    from?: string,
    to?: string
  ): Promise<GraphPoint[]>;
}
