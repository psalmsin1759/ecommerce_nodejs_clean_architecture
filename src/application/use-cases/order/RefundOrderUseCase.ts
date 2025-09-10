import { OrderRepository } from "../../../domain/repositories/OrderRepository";

export class RefundOrderUseCase {
  constructor(private repo: OrderRepository) {}
  async execute(id: string, refundAmount?: number) {
    const order = await this.repo.findById(id);
    if (!order) throw new Error("Order not found");
    if (order.payment.status !== "paid")
      throw new Error("Only paid orders can be refunded");

    const newTotals = { ...order.totals };
    if (typeof refundAmount === "number") {
      newTotals.grandTotal = Math.max(0, newTotals.grandTotal - refundAmount);
    }
    await this.repo.update(id, {
      status: "refunded",
      payment: { ...order.payment, status: "refunded" },
      totals: newTotals,
    } as any);
    return this.repo.findById(id);
  }
}
