import { OrderRepository } from "../../../domain/repositories/OrderRepository";

export class GetOrderTotalUseCase {
  constructor(private repo: OrderRepository) {}

  async execute(
    truncateTo: "day" | "week" | "month" | "year",
  ) {
    const total = await this.repo.totalByDate(truncateTo);
    return total;
  }
}
