// Melhorar a flexibilidade do código

import { Order } from "./order";
import { IPaymentGateway } from "./payment-gateway.interface";

/**
 * ⚙️ SERVIÇO DE APLICAÇÃO - Dependency Inversion Principle (DIP)
 * 
 * Esta classe demonstra o princípio da inversão de dependência:
 * - Depende da ABSTRAÇÃO (IPaymentGateway), não de implementações concretas
 * - Recebe a dependência via construtor (Injeção de Dependência)
 * - É desacoplada de gateways específicos
 * 
 * Benefícios:
 * - Fácil troca entre diferentes gateways
 * - Testabilidade com mocks
 * - Manutenibilidade
 * - Flexibilidade
 */
export class OrderProcessorService {
  /**
   * Construtor com injeção de dependência
   * @param gatewayPayment - Interface do gateway de pagamento (abstração)
   */
  constructor(private gatewayPayment: IPaymentGateway) {}

  /**
   * Processa um pedido usando o gateway de pagamento injetado
   * @param order - Pedido a ser processado
   */
  public process(order: Order): void {
    // Delega o processamento para o gateway específico
    // Não precisa saber qual gateway está sendo usado
    this.gatewayPayment.pay(order);
  }
}
