import { OrderRepository } from "../../../domain/repositories/OrderRepository";
import { CreateOrderDTO } from "../../dto/order/OrderDTO";
import { Order } from "../../../domain/entities/Order";

export class CreateOrderUseCase {
  constructor(private repo: OrderRepository) {}

  async execute(dto: CreateOrderDTO): Promise<Order> {
    const id = dto.id ?? `ORD-${Math.floor(Math.random() * 1000000)}`;
    const now = new Date().toISOString();
    const order: Order = {
      id,
      userId: dto.userId,
      orderDate: dto.orderDate ?? now,
      status: (dto.status as any) ?? "pending",
      items: dto.items as any,
      customer: dto.customer as any,
      billingAddress: dto.billingAddress as any,
      shippingAddress: dto.shippingAddress as any,
      payment: dto.payment as any,
      shipping: dto.shipping as any,
      totals: dto.totals as any,
      notes: dto.notes || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const created = await this.repo.create(order);
    return created;
  }
}
