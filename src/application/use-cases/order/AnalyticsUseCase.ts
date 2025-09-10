import { OrderRepository } from "../../../domain/repositories/OrderRepository";

export class AnalyticsUseCase {
  constructor(private repo: OrderRepository) {}

  async execute(
    truncateTo: "day" | "week" | "month" | "year",
    from?: string,
    to?: string
  ) {
    const counts = await this.repo.countByDate(truncateTo, from, to);
    const totals = await this.repo.totalByDate(truncateTo, from, to);
    const graph = await this.repo.graphData(truncateTo, from, to);
    return { counts, totals, graph };
  }
}
