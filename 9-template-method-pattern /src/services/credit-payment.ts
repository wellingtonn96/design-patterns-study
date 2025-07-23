import { PaymentTemplate } from "./payment-template";

export class CreditPayment extends PaymentTemplate {
  protected preparePayment(amount: number): { amount: number; method: string } {
    return { amount, method: "credit" };
  }

  protected executePayment(details: { amount: number; method: string }): {
    transactionId: string;
    status: string;
  } {
    // Simulação de execução de pagamento
    const transactionId = `txn-${Date.now()}`;
    console.log(
      `Processing credit payment of ${details.amount} using ${details.method}`
    );
    return { transactionId, status: "success" };
  }
}
