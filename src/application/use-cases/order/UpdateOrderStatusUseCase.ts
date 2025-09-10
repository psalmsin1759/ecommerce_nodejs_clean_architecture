import { OrderRepository } from "../../../domain/repositories/OrderRepository";

export class UpdateOrderStatusUseCase {
  constructor(private repo: OrderRepository) {}
  async execute(id: string, status: string) {
    return this.repo.update(id, { status } as any);
  }
}
