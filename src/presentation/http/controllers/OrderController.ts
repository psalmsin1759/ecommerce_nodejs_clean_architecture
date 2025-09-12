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
import { TopSellingUseCase } from "../../../application/use-cases/order/TopSellngUseCase";
import { OrderFilter } from "../../../domain/repositories/OrderRepository";

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

      const filter: OrderFilter = {
       status: req.query.status as OrderFilter["status"] | undefined,
        paymentStatus:
          (req.query.paymentStatus as OrderFilter["paymentStatus"]) ??
          undefined,
        shippingStatus: req.query.shippingStatus
          ? String(req.query.shippingStatus)
          : undefined,

        userId: req.query.userId ? String(req.query.userId) : undefined,
        customerEmail: req.query.customerEmail
          ? String(req.query.customerEmail)
          : undefined,
        customerPhone: req.query.customerPhone
          ? String(req.query.customerPhone)
          : undefined,

        from: req.query.from ? String(req.query.from) : undefined,
        to: req.query.to ? String(req.query.to) : undefined,

        search: req.query.search ? String(req.query.search) : undefined,

        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,

        sortBy: (req.query.sortBy as OrderFilter["sortBy"]) ?? undefined,
        sortOrder: (req.query.sortOrder as "asc" | "desc") ?? "desc",
      };

     
      if (filter.limit && filter.limit > 100) {
        filter.limit = 100;
      }

      const list = await useCase.execute(filter);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }


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
    
    try {
      const useCase = new GetOrderGraphDataUseCase(repo);
      const result = await useCase.execute();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async topSeller(req: Request, res: Response) {
    try {
      const { truncateTo } = req.params as any;
      const useCase = new TopSellingUseCase(repo);
      const result = await useCase.execute(truncateTo);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
