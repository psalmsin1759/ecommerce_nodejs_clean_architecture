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
        ProductImage: {
          type: "object",
          properties: {
            url: { type: "string", example: "https://cdn.example.com/p/123-main.jpg" },
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
              oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
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
          required: ["sku", "price", "stockQuantity", "isInStock", "attributes"],
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
