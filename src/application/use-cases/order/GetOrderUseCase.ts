import { OrderRepository } from "../../../domain/repositories/OrderRepository";
import { Order } from "../../../domain/entities/Order";

export class GetOrderUseCase {
  constructor(private repo: OrderRepository) {}
  async execute(id: string): Promise<Order | null> {
    return this.repo.findById(id);
  }
}
