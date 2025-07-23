export interface IPaymentGateway {
  processPayment(
    amount: number,
    orderId: string
  ): { transactionId: string; status: string };
}
