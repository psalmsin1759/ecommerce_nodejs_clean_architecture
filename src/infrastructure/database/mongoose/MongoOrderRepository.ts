import {
  OrderRepository,
  GraphPoint,
  OrderFilter,
  TopSalesValue,
} from "../../../domain/repositories/OrderRepository";
import { Order } from "../../../domain/entities/Order";
import { OrderModel } from "./models/OrderModel";

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

  async list(filter: OrderFilter = {}): Promise<{
    items: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit =
      filter.limit && filter.limit > 0 ? Math.min(filter.limit, 100) : 20;

    const query: any = {};

    // filters
    if (filter.status) query.status = filter.status;
    if (filter.paymentStatus) query["payment.status"] = filter.paymentStatus;
    if (filter.shippingStatus) query["shipping.status"] = filter.shippingStatus;

    if (filter.userId) query.userId = filter.userId;
    if (filter.customerEmail) query["customer.email"] = filter.customerEmail;
    if (filter.customerPhone) query["customer.phone"] = filter.customerPhone;

    if (filter.from || filter.to) query.orderDate = {};
    if (filter.from) query.orderDate.$gte = new Date(filter.from);
    if (filter.to) query.orderDate.$lte = new Date(filter.to);

    // Search by orderId, customer name, or SKU
    if (filter.search) {
      query.$or = [
        { id: { $regex: filter.search, $options: "i" } },
        { "customer.name": { $regex: filter.search, $options: "i" } },
        { "items.sku": { $regex: filter.search, $options: "i" } },
      ];
    }

    // sorting
    let sort: Record<string, 1 | -1> = { orderDate: -1 }; // default
    if (filter.sortBy) {
      sort = { [filter.sortBy]: filter.sortOrder === "asc" ? 1 : -1 };
    }

    // query
    const [items, total] = await Promise.all([
      OrderModel.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      OrderModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items as unknown as Order[],
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  private getDateRange(truncateTo: "day" | "week" | "month" | "year") {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (truncateTo) {
      case "day":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(start);
        end.setDate(start.getDate() + 1);
        break;
      case "week":
        const dayOfWeek = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 7);
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear() + 1, 0, 1);
        break;
    }
    return { start, end };
  }

  async countByDate(
    truncateTo: "day" | "week" | "month" | "year"
  ): Promise<{ count: number }> {
    const { start, end } = this.getDateRange(truncateTo);
    const count = await OrderModel.countDocuments({
      orderDate: { $gte: start, $lt: end },
    });
    return { count };
  }

  async totalByDate(
    truncateTo: "day" | "week" | "month" | "year"
  ): Promise<{ total: number }> {
    const { start, end } = this.getDateRange(truncateTo);

    const result = await OrderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totals.grandTotal" },
        },
      },
    ]);

    return { total: result[0]?.total || 0 };
  }

  async graphData(): Promise<GraphPoint[]> {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const result = await OrderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$orderDate" } },
          count: { $sum: 1 },
          total: { $sum: "$totals.grandTotal" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months.map((m, i) => {
      const found = result.find((r) => r._id.month === i + 1);
      return {
        month: m,
        count: found ? found.count : 0,
        total: found ? found.total : 0,
      };
    });
  }

  async topSellingProducts(
    truncateTo: "day" | "week" | "month" | "year"
  ): Promise<TopSalesValue[]> {
    const { start, end } = this.getDateRange(truncateTo);

    const result = await OrderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lt: end },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          count: { $sum: "$items.quantity" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    return result.map((r) => ({
      name: r.name,
      count: r.count,
    }));
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
