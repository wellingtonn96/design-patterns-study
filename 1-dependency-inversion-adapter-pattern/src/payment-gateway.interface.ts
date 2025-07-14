import { Order } from "./order";

/**
 * 🔌 INTERFACE - Princípio da Inversão de Dependência (DIP)
 * 
 * Esta interface define o contrato que todos os gateways de pagamento devem seguir.
 * É a ABSTRAÇÃO que permite que diferentes implementações sejam intercambiáveis.
 * 
 * Benefícios:
 * - Desacopla o código cliente das implementações concretas
 * - Permite fácil troca entre diferentes gateways
 * - Facilita testes com mocks
 * - Segue o princípio "dependa de abstrações, não de implementações"
 */
export interface IPaymentGateway {
  /**
   * Processa o pagamento de um pedido
   * @param order - O pedido a ser pago
   */
  pay(order: Order): void;
}
