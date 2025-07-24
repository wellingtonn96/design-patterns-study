import { Order } from "../models/order";
import { InventoryService } from "../services/inventory-service";
import { OrderFacade } from "../services/order-facade";
import { PaymentService } from "../services/payment-service";
import { ShippingService } from "../services/shipping-service";

describe("OrderFacade", () => {
  let facade: OrderFacade;
  let order: Order;

  beforeEach(() => {
    order = new Order("12345", 100);
    facade = new OrderFacade(
      new PaymentService(),
      new InventoryService(),
      new ShippingService()
    );

    jest.spyOn(console, "log").mockImplementation(); // mock console.log;
  });

  // para fazer um clean nos mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  // teste para verificar se o pedido foi processado corretamente por completo
  it("should process the order correctly", () => {
    const result = facade.processOrder(order);
    expect(result.status).toBe("completed");
    expect(order.status).toBe("completed");
    expect(console.log).toHaveBeenCalledWith(
      `Processing shipping for order ID: ${order.id} with value: ${order.amount}`
    );
    expect(console.log).toHaveBeenCalledWith(
      `Processing payment for order ID: ${order.id} with value: ${order.amount}`
    );
    expect(console.log).toHaveBeenCalledWith(
      `Processing inventory for order ID: ${order.id} with value: ${order.amount}`
    );
  });

  // testes para verificar se o valor é invalido
  it("should throw an error for invalid order amount", () => {
    expect(() => new Order("12345", -100)).toThrow("Valor inválido"); // teste para valor negativo
  });
});
