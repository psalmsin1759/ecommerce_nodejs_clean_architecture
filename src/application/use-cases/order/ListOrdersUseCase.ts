import {
  OrderRepository,
  OrderFilter,
} from "../../../domain/repositories/OrderRepository";

export class ListOrdersUseCase {
  constructor(private repo: OrderRepository) {}
  async execute(filter?: OrderFilter) {
    return this.repo.list(filter);
  }
}
