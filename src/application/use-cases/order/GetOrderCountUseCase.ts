import { OrderRepository } from "../../../domain/repositories/OrderRepository";

export class GetOrderCountUseCase {
  constructor(private repo: OrderRepository) {}

  async execute(
    truncateTo: "day" | "week" | "month" | "year",
  ) {
    const counts = await this.repo.countByDate(truncateTo);
    return counts;
  }
}
