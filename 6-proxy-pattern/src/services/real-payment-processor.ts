import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

export class RealOrderProcessorPayment implements IPaymentGateway {
  processPayment(
    amount: number,
    orderId: string
  ): { transactionId: string; status: string } {
    // Simulate processing payment
    console.log(`Processing payment of ${amount} for order ${orderId}`);

    // In a real implementation, this would interact with a payment gateway API
    return {
      transactionId: `txn_${orderId}`,
      status: "success",
    };
  }
}
