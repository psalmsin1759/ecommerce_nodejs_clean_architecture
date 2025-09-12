import { OrderRepository } from "../../../domain/repositories/OrderRepository";

export class TopSellingUseCase {
  constructor(private repo: OrderRepository) {}

  async execute(
    truncateTo: "day" | "week" | "month" | "year",
  ) {
    const total = await this.repo.topSellingProducts(truncateTo);
    return total;
  }
}
