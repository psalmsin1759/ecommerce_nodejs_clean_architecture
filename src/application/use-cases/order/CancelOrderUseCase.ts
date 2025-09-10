import { OrderRepository } from "../../../domain/repositories/OrderRepository";

export class CancelOrderUseCase {
  constructor(private repo: OrderRepository) {}
  async execute(id: string) {
    const order = await this.repo.findById(id);
    if (!order) throw new Error("Order not found");
    if (order.status === "delivered" || order.status === "refunded")
      throw new Error("Cannot cancel order in current status");
    return this.repo.update(id, { status: "cancelled" } as any);
  }
}
