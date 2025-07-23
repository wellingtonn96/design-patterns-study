import { Order } from "./models/order";
import { PaymentProxy } from "./services/payment-proxy";
import { RealOrderProcessorPayment } from "./services/real-payment-processor";

function main() {
  const order = new Order("order123", 100);

  const adminProcessor = new PaymentProxy(
    new RealOrderProcessorPayment(),
    "admin"
  );

  const userProcessor = new PaymentProxy(
    new RealOrderProcessorPayment(),
    "user"
  );

  console.log(
    "Processing payment as admin:",
    adminProcessor.processPayment(order.amount, order.id)
  );

  console.log(
    "Processing payment as user:",
    userProcessor.processPayment(order.amount, order.id)
  );

  const questProcessor = new PaymentProxy(
    new RealOrderProcessorPayment(),
    "guest"
  );

  try {
    console.log(
      "Processing payment as guest:",
      questProcessor.processPayment(order.amount, order.id)
    );
  } catch (error) {
    //@ts-ignore
    console.error(error.message);
  }

  order.complete();
  console.log(`Order ${order.id} completed with status: ${order.status}`);
}

main();
