import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { config } from "../../config/env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API documentation for the E-commerce platform",
    },
    servers: [
      {
          url: `${config.host}:${config.port}/api`, 
        /* url: `${config.host}/api`, */
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        OrderItem: {
          type: "object",
          properties: {
            productId: { type: "string", example: "prd_12345" },
            sku: { type: "string", example: "TSHIRT-RED-M" },
            name: { type: "string", example: "Red T-Shirt (M)" },
            quantity: { type: "integer", example: 2 },
            price: { type: "number", example: 45.99 },
            discount: { type: "number", example: 5 },
            tax: { type: "number", example: 2.5 },
            subtotal: { type: "number", example: 87.48 },
            imageUrl: {
              type: "string",
              example: "https://cdn.example.com/tshirt.jpg",
            },
            attributes: { type: "object", additionalProperties: true },
          },
          required: ["productId", "name", "quantity", "price", "subtotal"],
        },

        Customer: {
          type: "object",
          properties: {
            id: { type: "string", example: "usr_001" },
            name: { type: "string", example: "Jane Doe" },
            email: { type: "string", example: "jane@example.com" },
            phone: { type: "string", example: "+2348012345678" },
          },
          required: ["name", "email", "phone"],
        },

        Address: {
          type: "object",
          properties: {
            fullName: { type: "string", example: "Jane Doe" },
            street: { type: "string", example: "123 Main Street" },
            city: { type: "string", example: "Lagos" },
            state: { type: "string", example: "Lagos" },
            postalCode: { type: "string", example: "100001" },
            country: { type: "string", example: "Nigeria" },
          },
          required: [
            "fullName",
            "street",
            "city",
            "state",
            "postalCode",
            "country",
          ],
        },

        Payment: {
          type: "object",
          properties: {
            method: { type: "string", example: "card" },
            transactionId: { type: "string", example: "txn_123abc" },
            amountPaid: { type: "number", example: 100.0 },
            currency: { type: "string", example: "NGN" },
            status: {
              type: "string",
              enum: ["pending", "paid", "failed", "refunded"],
              example: "paid",
            },
          },
          required: ["method", "amountPaid", "currency", "status"],
        },

        Shipping: {
          type: "object",
          properties: {
            method: { type: "string", example: "DHL Express" },
            trackingNumber: { type: "string", example: "DHL123456789" },
            cost: { type: "number", example: 20.5 },
            estimatedDelivery: {
              type: "string",
              format: "date-time",
              example: "2025-09-15",
            },
            status: {
              type: "string",
              enum: ["pending", "shipped", "in_transit", "delivered"],
              example: "shipped",
            },
          },
          required: ["method", "cost", "status"],
        },

        Totals: {
          type: "object",
          properties: {
            subtotal: { type: "number", example: 100 },
            discount: { type: "number", example: 10 },
            tax: { type: "number", example: 5 },
            shipping: { type: "number", example: 15 },
            grandTotal: { type: "number", example: 110 },
          },
          required: ["subtotal", "shipping", "grandTotal"],
        },

        Order: {
          type: "object",
          properties: {
            id: { type: "string", example: "ord_001" },
            userId: { type: "string", example: "usr_001" },
            orderDate: { type: "string", format: "date-time" },
            status: {
              type: "string",
              enum: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled",
                "refunded",
              ],
              example: "pending",
            },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            customer: { $ref: "#/components/schemas/Customer" },
            billingAddress: { $ref: "#/components/schemas/Address" },
            shippingAddress: { $ref: "#/components/schemas/Address" },
            payment: { $ref: "#/components/schemas/Payment" },
            shipping: { $ref: "#/components/schemas/Shipping" },
            totals: { $ref: "#/components/schemas/Totals" },
            notes: {
              type: "string",
              nullable: true,
              example: "Leave at the front door",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "userId",
            "status",
            "items",
            "customer",
            "billingAddress",
            "shippingAddress",
            "payment",
            "shipping",
            "totals",
            "createdAt",
            "updatedAt",
          ],
        },

        CreateOrderDTO: {
          type: "object",
          properties: {
            userId: { type: "string" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            customer: { $ref: "#/components/schemas/Customer" },
            billingAddress: { $ref: "#/components/schemas/Address" },
            shippingAddress: { $ref: "#/components/schemas/Address" },
            payment: { $ref: "#/components/schemas/Payment" },
            shipping: { $ref: "#/components/schemas/Shipping" },
            totals: { $ref: "#/components/schemas/Totals" },
            notes: { type: "string", nullable: true },
          },
          required: [
            "userId",
            "items",
            "customer",
            "billingAddress",
            "shippingAddress",
            "payment",
            "shipping",
            "totals",
          ],
        },

        ProductImage: {
          type: "object",
          properties: {
            url: {
              type: "string",
              example: "https://cdn.example.com/p/123-main.jpg",
            },
            alt: { type: "string", example: "Front view" },
            isPrimary: { type: "boolean", example: true },
          },
          required: ["url"],
        },

        ProductAttribute: {
          type: "object",
          properties: {
            name: { type: "string", example: "Color" },
            value: {
              oneOf: [
                { type: "string" },
                { type: "number" },
                { type: "boolean" },
              ],
              example: "Red",
            },
            visible: { type: "boolean", example: true },
            variation: { type: "boolean", example: false },
          },
          required: ["name", "value"],
        },

        ProductVariant: {
          type: "object",
          properties: {
            sku: { type: "string", example: "TSHIRT-RED-M" },
            name: { type: "string", example: "Red / M" },
            price: { type: "number", example: 45.99 },
            salePrice: { type: "number", example: 39.99 },
            stockQuantity: { type: "integer", example: 120 },
            isInStock: { type: "boolean", example: true },
            attributes: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductAttribute" },
            },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductImage" },
            },
          },
          required: [
            "sku",
            "price",
            "stockQuantity",
            "isInStock",
            "attributes",
          ],
        },

        ProductReview: {
          type: "object",
          properties: {
            id: { type: "string", example: "rev_01H..." },
            userId: { type: "string", example: "usr_123" },
            userName: { type: "string", example: "Jane Doe" },
            rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
            comment: { type: "string", example: "Great quality!" },
            createdAt: { type: "string", format: "date-time" },
          },
          required: ["userId", "userName", "rating", "comment", "createdAt"],
        },

        // Body for POST /products
        CreateProductDTO: {
          type: "object",
          properties: {
            sku: { type: "string", example: "TSHIRT-RED" },
            slug: { type: "string", example: "tshirt-red" },
            name: { type: "string", example: "Red T-Shirt" },
            description: { type: "string", example: "Soft cotton tee in red." },
            shortDescription: { type: "string", example: "Classic red tee" },
            categories: {
              type: "array",
              items: { type: "string", example: "64f07b2d9c3a2e001ed1b9aa" },
            },
            price: { type: "number", example: 49.99 },
            salePrice: { type: "number", example: 39.99 },
            discountPercentage: { type: "number", example: 20 },
            stockQuantity: { type: "integer", example: 200 },
            isInStock: { type: "boolean", example: true },
            variants: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductVariant" },
            },
            attributes: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductAttribute" },
            },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductImage" },
            },
            isFeatured: { type: "boolean", example: false },
            isPublished: { type: "boolean", example: true },
          },
          required: [
            "sku",
            "slug",
            "name",
            "description",
            "categories",
            "price",
            "stockQuantity",
            "isInStock",
            "images",
            "isPublished",
          ],
        },

        // Body for PUT /products/{id}
        UpdateProductDTO: {
          type: "object",
          properties: {
            sku: { type: "string" },
            slug: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            shortDescription: { type: "string" },
            categories: {
              type: "array",
              items: { type: "string" },
            },
            price: { type: "number" },
            salePrice: { type: "number" },
            discountPercentage: { type: "number" },
            stockQuantity: { type: "integer" },
            isInStock: { type: "boolean" },
            variants: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductVariant" },
            },
            attributes: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductAttribute" },
            },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductImage" },
            },
            isFeatured: { type: "boolean" },
            isPublished: { type: "boolean" },
          },
        },

        // Full Product returned in responses
        Product: {
          type: "object",
          properties: {
            id: { type: "string", example: "64c0f4f2c1d4e9a0d8a1b123" },
            sku: { type: "string", example: "TSHIRT-RED" },
            slug: { type: "string", example: "tshirt-red" },
            name: { type: "string", example: "Red T-Shirt" },
            description: { type: "string", example: "Soft cotton tee in red." },
            shortDescription: { type: "string", example: "Classic red tee" },
            categories: {
              type: "array",
              items: { type: "string" },
              example: ["64f07b2d9c3a2e001ed1b9aa"],
            },
            price: { type: "number", example: 49.99 },
            salePrice: { type: "number", example: 39.99 },
            discountPercentage: { type: "number", example: 20 },
            stockQuantity: { type: "integer", example: 200 },
            isInStock: { type: "boolean", example: true },
            variants: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductVariant" },
            },
            attributes: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductAttribute" },
            },
            images: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductImage" },
            },
            averageRating: { type: "number", example: 4.5 },
            reviewCount: { type: "integer", example: 12 },
            reviews: {
              type: "array",
              items: { $ref: "#/components/schemas/ProductReview" },
            },
            isFeatured: { type: "boolean", example: false },
            isPublished: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
          required: [
            "id",
            "sku",
            "slug",
            "name",
            "description",
            "categories",
            "price",
            "stockQuantity",
            "isInStock",
            "images",
            "isPublished",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    },
  },
  apis: ["./src/presentation/http/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
