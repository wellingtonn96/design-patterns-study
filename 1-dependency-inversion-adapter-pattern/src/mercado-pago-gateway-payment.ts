import { MercadoPagoAPI } from "./mercado-pago";
import { Order } from "./order";
import { IPaymentGateway } from "./payment-gateway.interface";

/**
 * 🔌 ADAPTER - Padrão Adapter + Dependency Inversion
 * 
 * Esta classe implementa o padrão Adapter para o Mercado Pago:
 * - Adapta a API específica do Mercado Pago para nossa interface IPaymentGateway
 * - Encapsula a complexidade de integração com o Mercado Pago
 * - Permite que o Mercado Pago seja usado como qualquer outro gateway
 * 
 * Estrutura do Adapter:
 * - Target: IPaymentGateway (interface desejada)
 * - Adaptee: MercadoPagoAPI (interface existente)
 * - Adapter: MercadoPagoPaymentGateway (classe atual)
 * - Client: OrderProcessorService
 */
export class MercadoPagoPaymentGateway implements IPaymentGateway {
  /**
   * Implementação do método pay da interface IPaymentGateway
   * Adapta a API do Mercado Pago para nossa interface padrão
   * @param order - Pedido a ser pago
   */
  pay(order: Order): void {
    // Cria instância do cliente Mercado Pago
    const mercadoPago = new MercadoPagoAPI({
      accessToken: "APP_USR-123456789", // Token de acesso (em produção viria de variável de ambiente)
      baseUrl: "https://api.mercadopago.com",
    });

    // Adapta os dados do pedido para o formato esperado pelo Mercado Pago
    // Esta é a parte que "traduz" entre nossa interface e a API do Mercado Pago
    mercadoPago.createPayment({
      description: `Pedido ${order.id} - Cliente ${order.customerId}`,
      installments: 1, // Parcelamento (1 = à vista)
      payer: {
        email: "cliente@exemplo.com", // Em produção viria do pedido
        identification: {
          number: "12345678", // CPF do cliente
          type: "CPF",
        },
      },
      payment_method_id: "visa", // Método de pagamento
      token: "ff8080814c11e237014c1ff593b57b4d", // Token do cartão
      transaction_amount: order.total, // Valor da transação
    });
  }
}
