import { OrderRepository } from "../../../domain/repositories/OrderRepository";
import { Order } from "../../../domain/entities/Order";
import { OrderModel } from "./models/OrderModel";
import mongoose from "mongoose";

export class MongoOrderRepository implements OrderRepository {
    
  async create(order: Order): Promise<Order> {
    const doc = await OrderModel.create({
      ...order,
      orderDate: new Date(order.orderDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await OrderModel.findOne({ id }).lean();
    return doc ? (doc as unknown as Order) : null;
  }

  async update(id: string, update: Partial<Order>): Promise<Order | null> {
    const doc = await OrderModel.findOneAndUpdate(
      { id },
      { ...update, updatedAt: new Date() },
      { new: true }
    ).lean();
    return doc ? (doc as unknown as Order) : null;
  }

  async delete(id: string): Promise<boolean> {
    const res = await OrderModel.deleteOne({ id });
    return res.deletedCount === 1;
  }

  async list(filter: any = {}): Promise<{ items: Order[]; total: number }> {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit =
      filter.limit && filter.limit > 0 ? Math.min(filter.limit, 100) : 20;
    const query: any = {};
    if (filter.status) query.status = filter.status;
    if (filter.userId) query.userId = filter.userId;
    if (filter.from || filter.to) query.orderDate = {};
    if (filter.from) query.orderDate.$gte = new Date(filter.from);
    if (filter.to) query.orderDate.$lte = new Date(filter.to);

    const [items, total] = await Promise.all([
      OrderModel.find(query)
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      OrderModel.countDocuments(query),
    ]);
    return { items: items as unknown as Order[], total };
  }
  private buildDateMatch(from?: string, to?: string) {
    const match: any = {};
    if (from || to) match.orderDate = {};
    if (from) match.orderDate.$gte = new Date(from);
    if (to) match.orderDate.$lte = new Date(to);
    return Object.keys(match).length ? match : null;
  }

  async countByDate(
    truncateTo: "day" | "week" | "month" | "year",
    from?: string,
    to?: string
  ) {
    const match = this.buildDateMatch(from, to);
    const groupBy = { $dateTrunc: { date: "$orderDate", unit: truncateTo } };
    const pipeline: any[] = [];
    if (match) pipeline.push({ $match: match });
    pipeline.push({ $group: { _id: groupBy, count: { $sum: 1 } } });
    pipeline.push({ $sort: { _id: 1 } });
    pipeline.push({ $project: { period: "$_id", count: 1, _id: 0 } });

    const res = await OrderModel.aggregate(pipeline);
    return res.map((r: any) => ({
      period: r.period.toISOString(),
      count: r.count,
    }));
  }
  async totalByDate(
    truncateTo: "day" | "week" | "month" | "year",
    from?: string,
    to?: string
  ) {
    const match = this.buildDateMatch(from, to);
    const groupBy = { $dateTrunc: { date: "$orderDate", unit: truncateTo } };
    const pipeline: any[] = [];
    if (match) pipeline.push({ $match: match });
    pipeline.push({
      $group: { _id: groupBy, total: { $sum: "$totals.grandTotal" } },
    });
    pipeline.push({ $sort: { _id: 1 } });
    pipeline.push({ $project: { period: "$_id", total: 1, _id: 0 } });

    const res = await OrderModel.aggregate(pipeline);
    return res.map((r: any) => ({
      period: r.period.toISOString(),
      total: r.total,
    }));
  }

  async graphData(
    truncateTo: "day" | "week" | "month" | "year",
    from?: string,
    to?: string
  ) {
    // reuse totalByDate and normalize to GraphPoint
    const totals = await this.totalByDate(truncateTo, from, to);
    return totals.map((t) => ({ period: t.period, value: t.total }));
  }

  private toDomain(doc: any): Order {
    const d = doc.toObject ? doc.toObject() : doc;
    return {
      id: d.id,
      userId: d.userId,
      orderDate: d.orderDate.toISOString(),
      status: d.status,
      items: d.items,
      customer: d.customer,
      billingAddress: d.billingAddress,
      shippingAddress: d.shippingAddress,
      payment: d.payment,
      shipping: d.shipping,
      totals: d.totals,
      notes: d.notes,
      createdAt: d.createdAt ? d.createdAt.toISOString() : undefined,
      updatedAt: d.updatedAt ? d.updatedAt.toISOString() : undefined,
    };
  }
}
