/**
 * 📖 EXEMPLO DE USO - Dependency Inversion + Adapter Pattern
 * 
 * Este arquivo demonstra como usar o sistema de processamento de pedidos
 * com diferentes gateways de pagamento, mostrando os benefícios dos
 * princípios aplicados.
 */

import { Order, OrderItem } from "./order";
import { OrderProcessorService } from "./order-processor";
import { StripeGatewayPayment } from "./stripe-gateway-payment";
import { MercadoPagoPaymentGateway } from "./mercado-pago-gateway-payment";

/**
 * Função que demonstra o uso do sistema com Stripe
 */
function processOrderWithStripe(): void {
  console.log("\n🔵 === PROCESSANDO PEDIDO COM STRIPE ===");
  
  // Criar itens do pedido
  const items = [
    new OrderItem("item1", "prod123", 50.00, 2), // 2x R$ 50,00
    new OrderItem("item2", "prod456", 25.00, 1), // 1x R$ 25,00
  ];

  // Criar pedido
  const order = new Order("order123", "user456", items, 125.00);

  // Criar gateway Stripe
  const stripeGateway = new StripeGatewayPayment();
  
  // Criar processador de pedidos com injeção de dependência
  const orderProcessor = new OrderProcessorService(stripeGateway);
  
  // Processar pedido
  orderProcessor.process(order);
}

/**
 * Função que demonstra o uso do sistema com Mercado Pago
 */
function processOrderWithMercadoPago(): void {
  console.log("\n🟡 === PROCESSANDO PEDIDO COM MERCADO PAGO ===");
  
  // Criar itens do pedido
  const items = [
    new OrderItem("item3", "prod789", 100.00, 1), // 1x R$ 100,00
    new OrderItem("item4", "prod012", 30.00, 3),  // 3x R$ 30,00
  ];

  // Criar pedido
  const order = new Order("order456", "user789", items, 190.00);

  // Criar gateway Mercado Pago
  const mercadoPagoGateway = new MercadoPagoPaymentGateway();
  
  // Criar processador de pedidos com injeção de dependência
  const orderProcessor = new OrderProcessorService(mercadoPagoGateway);
  
  // Processar pedido
  orderProcessor.process(order);
}

/**
 * Função que demonstra a flexibilidade do sistema
 * (troca de gateway em tempo de execução)
 */
function demonstrateFlexibility(): void {
  console.log("\n🔄 === DEMONSTRANDO FLEXIBILIDADE ===");
  
  // Criar pedido
  const order = new Order("order789", "user123", [
    new OrderItem("item5", "prod345", 75.00, 1)
  ], 75.00);

  // Criar processador com Stripe
  const processor = new OrderProcessorService(new StripeGatewayPayment());
  processor.process(order);

  // Trocar para Mercado Pago SEM modificar o código cliente
  console.log("\n🔄 Trocando gateway para Mercado Pago...");
  // Em um sistema real, isso poderia ser feito via configuração ou factory
  const newProcessor = new OrderProcessorService(new MercadoPagoPaymentGateway());
  newProcessor.process(order);
}

/**
 * Função que demonstra como seria um teste unitário
 */
function demonstrateTestability(): void {
  console.log("\n🧪 === DEMONSTRANDO TESTABILIDADE ===");
  
  // Mock do gateway para testes
  class MockPaymentGateway {
    public pay(order: Order): void {
      console.log("🧪 Mock Gateway: Simulando pagamento...");
      console.log(`   Pedido: ${order.id}`);
      console.log(`   Cliente: ${order.customerId}`);
      console.log(`   Valor: R$ ${order.total.toFixed(2)}`);
      console.log("   ✅ Pagamento simulado com sucesso!");
    }
  }

  // Criar pedido de teste
  const testOrder = new Order("test123", "testuser", [
    new OrderItem("testitem", "testprod", 50.00, 1)
  ], 50.00);

  // Usar mock no processador
  const testProcessor = new OrderProcessorService(new MockPaymentGateway());
  testProcessor.process(testOrder);
}

/**
 * Função principal que executa todos os exemplos
 */
function main(): void {
  console.log("🎯 EXEMPLOS - Dependency Inversion + Adapter Pattern");
  console.log("=" .repeat(60));
  
  // Executar exemplos
  processOrderWithStripe();
  processOrderWithMercadoPago();
  demonstrateFlexibility();
  demonstrateTestability();
  
  console.log("\n" + "=" .repeat(60));
  console.log("✅ Todos os exemplos executados com sucesso!");
  console.log("\n💡 Benefícios demonstrados:");
  console.log("   - Flexibilidade: Troca fácil entre gateways");
  console.log("   - Testabilidade: Uso de mocks");
  console.log("   - Manutenibilidade: Código desacoplado");
  console.log("   - Extensibilidade: Novos gateways fáceis de adicionar");
}

export {
  processOrderWithStripe,
  processOrderWithMercadoPago,
  demonstrateFlexibility,
  demonstrateTestability,
  main
};

// Executar a função principal quando o arquivo for executado
main(); 