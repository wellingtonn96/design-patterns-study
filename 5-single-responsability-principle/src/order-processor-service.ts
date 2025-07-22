import { Order } from "./order";

// Serviço responsável por processar pedidos
// Aplica o princípio da responsabilidade única delegando tarefas específicas para classes especializadas
export class OrderProcessorService {
  constructor(
    private inventoryChecker: InventoryChecker, // Responsável por checar o estoque
    private paymentProcessor: PaymentProcessor, // Responsável por processar o pagamento
    private orderCalculator: OrderCalculator // Responsável por calcular o valor do pedido
  ) {}

  // Processa o pedido utilizando os serviços especializados
  public processOrder(order: Order): void {
    this.inventoryChecker.check(order); // Verifica o estoque
    const total = this.orderCalculator.calculate(order); // Calcula o valor total
    console.log(`Total amount for order ${order.getItems()}: ${total}`);
    const paymentSuccess = this.paymentProcessor.process(order); // Processa o pagamento
    if (!paymentSuccess) {
      throw new Error("Payment processing failed");
    }
    order.closeOrder(); // Fecha o pedido
    console.log(`Order ${order.getItems()} processed successfully.`);
  }
}

// Classe responsável por verificar o estoque
export class InventoryChecker {
  public check(order: Order): boolean {
    // Lógica de verificação de estoque
    return true;
  }
}

// Classe responsável por processar o pagamento
export class PaymentProcessor {
  public process(order: Order): boolean {
    // Lógica de processamento de pagamento
    return true;
  }
}

// Classe responsável por calcular o valor do pedido
export class OrderCalculator {
  public calculate(order: Order): number {
    return order.getTotal();
  }
}
