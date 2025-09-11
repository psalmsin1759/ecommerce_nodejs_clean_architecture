import express from "express";
import { OrderController } from "../controllers/OrderController";
import { z } from "zod";
import {
  CreateOrderValidator,
  UpdateOrderValidator,
  CancelOrderValidator,
  RefundOrderValidator,
  AnalyticsValidator,
} from "../../../application/validators/OrderValidator";

const orderRouter = express.Router();
const controller = new OrderController();

function validate(
  schema: z.ZodSchema<any>,
  property: "body" | "query" | "params" = "body"
) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    req[property] = result.data;
    next();
  };
}

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDTO'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
orderRouter.post("/", validate(CreateOrderValidator), (req, res) =>
  controller.create(req, res)
);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
orderRouter.get("/:id", (req, res) => controller.get(req, res));

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, in_transit, delivered, cancelled, refunded]
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
orderRouter.patch("/:id/status", validate(UpdateOrderValidator), (req, res) =>
  controller.updateStatus(req, res)
);

/**
 * @openapi
 * /orders/{id}/cancel:
 *   post:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
orderRouter.post("/:id/cancel", validate(CancelOrderValidator), (req, res) =>
  controller.cancel(req, res)
);
/**
 * @openapi
 * /orders/{id}/refund:
 *   post:
 *     summary: Refund an order
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refundAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order refunded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
orderRouter.post("/:id/refund", validate(RefundOrderValidator), (req, res) =>
  controller.refund(req, res)
);
/**
 * @openapi
 * /orders:
 *   get:
 *     summary: List orders with filters
 *     tags: [Orders]
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: userId
 *         in: query
 *         schema:
 *           type: string
 *       - name: from
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: to
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
orderRouter.get("/", (req, res) => controller.list(req, res));
/**
 * @openapi
 * /orders/analytics/{truncateTo}:
 *   get:
 *     summary: Get order analytics
 *     tags: [Orders]
 *     parameters:
 *       - name: truncateTo
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *       - name: from
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: to
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                 totalAmount:
 *                   type: number
 *                 graphData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       count:
 *                         type: number
 */
/* orderRouter.get(
  "/analytics/:truncateTo",
  validate(AnalyticsValidator, "params"),
  (req, res) => controller.analytics(req, res)
); */


/**
 * @openapi
 * /orders/count/{truncateTo}:
 *   get:
 *     summary: Get order analytics
 *     tags: [Orders]
 *     parameters:
 *       - name: truncateTo
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *       
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                 totalAmount:
 *                   type: number
 *                 graphData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       count:
 *                         type: number
 */
orderRouter.get(
  "/count/:truncateTo",
  (req, res) => controller.count(req, res)
);

/**
 * @openapi
 * /orders/total/{truncateTo}:
 *   get:
 *     summary: Get order analytics
 *     tags: [Orders]
 *     parameters:
 *       - name: truncateTo
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *       
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 totalAmount:
 *                   type: number
 *                 graphData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       count:
 *                         type: number
 */
orderRouter.get(
  "/total/:truncateTo",
  (req, res) => controller.total(req, res)
);


/**
 * @openapi
 * /orders/graph/data:
 *   get:
 *     summary: Get order analytics
 *     tags: [Orders]
 *       
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                 totalAmount:
 *                   type: number
 *                 graphData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       count:
 *                         type: number
 */
orderRouter.get(
  "/graph/data",
  (req, res) => controller.graph(req, res)
);

export default orderRouter;
