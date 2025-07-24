import { Order } from "../models/order";
import { InventoryService } from "./inventory-service";
import { PaymentService } from "./payment-service";
import { ShippingService } from "./shipping-service";

export class OrderFacade {
  private shippingService: ShippingService;
  private paymentService: PaymentService;
  private inventoryService: InventoryService;

  constructor(
    shippingService: ShippingService,
    paymentService: PaymentService,
    inventoryService: InventoryService
  ) {
    this.shippingService = shippingService;
    this.paymentService = paymentService;
    this.inventoryService = inventoryService;
  }

  processOrder(order: Order): { transactionId: string; status: string } {
    const transactionId = this.paymentService.process(order.id, order.amount);
    this.inventoryService.process(order.id, order.amount);
    this.shippingService.process(order.id, order.amount);
    order.complete();
    return {
      transactionId,
      status: "completed",
    };
  }
}
