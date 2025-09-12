import { faker } from "@faker-js/faker";
import { Order } from "../../../domain/entities/Order";
import { OrderModel } from "../mongoose/models/OrderModel";
import { OrderStatus, PaymentStatus } from "../../../domain/entities/Order";

export function generateFakeOrder(): Order {
  const orderId = faker.string.uuid();
  const orderDate = faker.date.between({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const items = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
    () => {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = faker.number.int({ min: 1000, max: 20000 });
      return {
        productId: faker.string.uuid(),
        sku: faker.commerce.isbn(),
        name: faker.commerce.productName(),
        quantity,
        price,
        discount: 0,
        tax: Math.round(price * 0.1),
        subtotal: quantity * price,
        imageUrl: faker.image.url(),
        attributes: { color: faker.color.human(), size: faker.helpers.arrayElement(["S", "M", "L"]) },
      };
    }
  );

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const tax = Math.round(subtotal * 0.1);
  const shipping = faker.number.int({ min: 500, max: 2000 });
  const grandTotal = subtotal + tax + shipping;

  return {
    id: orderId,
    userId: faker.string.uuid(),
    orderDate: orderDate.toISOString(),
    status: faker.helpers.arrayElement<OrderStatus>([
      "pending",
      "confirmed",
      "shipped",
      "in_transit",
      "delivered",
      "cancelled",
      "refunded",
    ]),
    items,
    customer: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    },
    billingAddress: {
      fullName: faker.person.fullName(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      postalCode: faker.location.zipCode(),
    },
    shippingAddress: {
      fullName: faker.person.fullName(),
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      postalCode: faker.location.zipCode(),
    },
    payment: {
      method: faker.helpers.arrayElement(["card", "bank_transfer", "paypal"]),
      transactionId: faker.string.uuid(),
      amountPaid: grandTotal,
      currency: "USD",
      status: faker.helpers.arrayElement<PaymentStatus>([
        "pending",
        "paid",
        "failed",
        "refunded",
      ]),
    },
    shipping: {
      method: "Standard",
      trackingNumber: faker.string.uuid(),
      cost: shipping,
      estimatedDelivery: faker.date.soon().toISOString(),
      status: faker.helpers.arrayElement(["preparing", "shipped", "in_transit", "delivered"]),
    },
    totals: {
      subtotal,
      tax,
      shipping,
      grandTotal,
    },
    notes: faker.lorem.sentence(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function seedOrders(count = 40) {
  const fakeOrders = Array.from({ length: count }, () => generateFakeOrder());
  await OrderModel.insertMany(fakeOrders);
  console.log(`Inserted ${count} fake orders`);
}
