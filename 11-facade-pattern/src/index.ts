import { Order } from "./models/order";
import { OrderFacade } from "./services/order-facade";
import { PaymentService } from "./services/payment-service";
import { InventoryService } from "./services/inventory-service";
import { ShippingService } from "./services/shipping-service";

function main() {
  const order = new Order("12345", 100);
  const facade = new OrderFacade(
    new ShippingService(),
    new PaymentService(),
    new InventoryService()
  );

  const result = facade.processOrder(order);
  console.log(`Order processed: ${JSON.stringify(result)}`);
}

main();
