import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

export class PaymentProxy implements IPaymentGateway {
  private cache: Map<string, { transactionId: string; status: string }> =
    new Map();

  constructor(
    private realProcessor: IPaymentGateway,
    private userRole: string
  ) {}

  processPayment(
    amount: number,
    orderId: string
  ): { transactionId: string; status: string } {
    // Controle de acesso
    if (this.userRole !== "admin") {
      throw new Error(
        "Acesso negado: apenas administradores podem processar pagamentos"
      );
    }

    // Verifica cache
    const cacheKey = `${orderId}_${amount}`;
    if (this.cache.has(cacheKey)) {
      console.log(`Retornando resultado do cache para pedido ${orderId}`);
      return this.cache.get(cacheKey)!;
    }

    // Chama o serviço real
    const result = this.realProcessor.processPayment(amount, orderId);
    this.cache.set(cacheKey, result);
    return result;
  }
}
