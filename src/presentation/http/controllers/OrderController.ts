import { Request, Response } from "express";
import { MongoOrderRepository } from "../../../infrastructure/database/mongoose/MongoOrderRepository";
import { CreateOrderUseCase } from "../../../application/use-cases/order/CreateOrderUseCase";
import { GetOrderUseCase } from "../../../application/use-cases/order/GetOrderUseCase";
import { UpdateOrderStatusUseCase } from "../../../application/use-cases/order/UpdateOrderStatusUseCase";
import { CancelOrderUseCase } from "../../../application/use-cases/order/CancelOrderUseCase";
import { RefundOrderUseCase } from "../../../application/use-cases/order/RefundOrderUseCase";
import { ListOrdersUseCase } from "../../../application/use-cases/order/ListOrdersUseCase";
import { AnalyticsUseCase } from "../../../application/use-cases/order/AnalyticsUseCase";

const repo = new MongoOrderRepository();

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const usecase = new CreateOrderUseCase(repo);
      const order = await usecase.execute(req.body);
      res.status(201).json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Order ID is required" });
      const usecase = new GetOrderUseCase(repo);
      const order = await usecase.execute(id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Order ID is required" });
      const usecase = new UpdateOrderStatusUseCase(repo);
      const updated = await usecase.execute(id, req.body.status);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Order ID is required" });
      const usecase = new CancelOrderUseCase(repo);
      const updated = await usecase.execute(id);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async refund(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Order ID is required" });
      const usecase = new RefundOrderUseCase(repo);
      const updated = await usecase.execute(id, req.body.refundAmount);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const usecase = new ListOrdersUseCase(repo);
      const filter = {
        status: req.query.status as string,
        userId: req.query.userId as string,
        from: req.query.from as string,
        to: req.query.to as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      };
      const list = await usecase.execute(filter);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async analytics(req: Request, res: Response) {
    try {
      const { truncateTo } = req.params as any;
      const { from, to } = req.query as any;
      const usecase = new AnalyticsUseCase(repo);
      const result = await usecase.execute(truncateTo, from, to);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
