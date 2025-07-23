// src/services/payment-template.ts
import { Order } from "../models/order";

export abstract class PaymentTemplate {
  processPayment(order: Order): { transactionId: string; status: string } {
    // Fluxo comum
    this.validateOrder(order);
    const paymentDetails = this.preparePayment(order.amount);
    const transaction = this.executePayment(paymentDetails);
    this.updateOrderStatus(order);
    return transaction;
  }

  protected validateOrder(order: Order): void {
    if (order.amount <= 0) throw new Error("Valor inválido para pagamento");
  }

  protected abstract preparePayment(amount: number): {
    amount: number;
    method: string;
  };

  protected abstract executePayment(details: {
    amount: number;
    method: string;
  }): { transactionId: string; status: string };
  protected updateOrderStatus(order: Order): void {
    order.complete();
  }
}
