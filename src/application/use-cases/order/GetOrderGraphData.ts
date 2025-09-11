import { OrderRepository } from "../../../domain/repositories/OrderRepository";

export class GetOrderGraphDataUseCase {
  constructor(private repo: OrderRepository) {}

  async execute() {
    const counts = await this.repo.graphData();
    return counts;
  }
}
