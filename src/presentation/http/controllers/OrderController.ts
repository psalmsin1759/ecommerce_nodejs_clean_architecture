import { Request, Response } from "express";
import { MongoOrderRepository } from "../../../infrastructure/database/mongoose/MongoOrderRepository";
import { CreateOrderUseCase } from "../../../application/use-cases/order/CreateOrderUseCase";
import { GetOrderUseCase } from "../../../application/use-cases/order/GetOrderUseCase";
import { UpdateOrderStatusUseCase } from "../../../application/use-cases/order/UpdateOrderStatusUseCase";
import { CancelOrderUseCase } from "../../../application/use-cases/order/CancelOrderUseCase";
import { RefundOrderUseCase } from "../../../application/use-cases/order/RefundOrderUseCase";
import { ListOrdersUseCase } from "../../../application/use-cases/order/ListOrdersUseCase";
import { GetOrderTotalUseCase } from "../../../application/use-cases/order/GetOrderTotalUseCase";
import { GetOrderCountUseCase } from "../../../application/use-cases/order/GetOrderCountUseCase";
import { GetOrderGraphDataUseCase } from "../../../application/use-cases/order/GetOrderGraphData";

const repo = new MongoOrderRepository();

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const useCase = new CreateOrderUseCase(repo);
      const order = await useCase.execute(req.body);
      res.status(201).json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Order ID is required" });
      const useCase = new GetOrderUseCase(repo);
      const order = await useCase.execute(id);
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
      const useCase = new UpdateOrderStatusUseCase(repo);
      const updated = await useCase.execute(id, req.body.status);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Order ID is required" });
      const useCase = new CancelOrderUseCase(repo);
      const updated = await useCase.execute(id);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async refund(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "Order ID is required" });
      const useCase = new RefundOrderUseCase(repo);
      const updated = await useCase.execute(id, req.body.refundAmount);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const useCase = new ListOrdersUseCase(repo);
      const filter = {
        status: req.query.status as string,
        userId: req.query.userId as string,
        from: req.query.from as string,
        to: req.query.to as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
      };
      const list = await useCase.execute(filter);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  /* async analytics(req: Request, res: Response) {
    try {
      const { truncateTo } = req.params as any;
      const { from, to } = req.query as any;
      const useCase = new AnalyticsUseCase(repo);
      const result = await useCase.execute(truncateTo, from, to);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } */

   async count(req: Request, res: Response) {
    try {
      const { truncateTo } = req.params as any;
      const useCase = new GetOrderCountUseCase(repo);
      const result = await useCase.execute(truncateTo);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

   async total(req: Request, res: Response) {
    try {
      const { truncateTo } = req.params as any;
      const useCase = new GetOrderTotalUseCase(repo);
      const result = await useCase.execute(truncateTo);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

   async graph(req: Request, res: Response) {
    console.log ("start")
    try {
      const useCase = new GetOrderGraphDataUseCase(repo);
      const result = await useCase.execute();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
