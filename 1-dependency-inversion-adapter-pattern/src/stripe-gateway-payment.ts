import { Order } from "./order";
import { IPaymentGateway } from "./payment-gateway.interface";
import { StripeClient } from "./stripe";

/**
 * 🔌 ADAPTER - Padrão Adapter + Dependency Inversion
 * 
 * Esta classe implementa o padrão Adapter para o Stripe:
 * - Adapta a API específica do Stripe para nossa interface IPaymentGateway
 * - Encapsula a complexidade de integração com o Stripe
 * - Permite que o Stripe seja usado como qualquer outro gateway
 * 
 * Estrutura do Adapter:
 * - Target: IPaymentGateway (interface desejada)
 * - Adaptee: StripeClient (interface existente)
 * - Adapter: StripeGatewayPayment (classe atual)
 * - Client: OrderProcessorService
 */
export class StripeGatewayPayment implements IPaymentGateway {
  constructor() {}

  /**
   * Implementação do método pay da interface IPaymentGateway
   * Adapta a API do Stripe para nossa interface padrão
   * @param order - Pedido a ser pago
   */
  public pay(order: Order): void {
    // Cria instância do cliente Stripe
    const stripe = new StripeClient("apikey");

    // Adapta os dados do pedido para o formato esperado pelo Stripe
    // Esta é a parte que "traduz" entre nossa interface e a API do Stripe
    stripe.createCharge({
      amount: order.total * 100, // Stripe trabalha em centavos
      currency: "BRL",           // Moeda brasileira
      source: "tok_visa",        // Token do cartão (em produção viria do frontend)
      description: `Pedido ${order.id} - Cliente ${order.customerId}`,
    });
  }
}
