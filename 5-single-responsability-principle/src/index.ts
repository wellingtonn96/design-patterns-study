import { Order } from "./order";
import {
  InventoryChecker,
  OrderCalculator,
  OrderProcessorService,
  PaymentProcessor,
} from "./order-processor-service";

// Cria um novo pedido com uuid e valor inicial
const order = new Order({
  uuid: "123",
  amount: 100,
});

// Instancia o serviço de processamento de pedidos com as dependências especializadas
const orderProcessorService = new OrderProcessorService(
  new InventoryChecker(),
  new PaymentProcessor(),
  new OrderCalculator()
);

// Processa o pedido e exibe o resultado
console.log("Initial order total:", orderProcessorService.processOrder(order));
