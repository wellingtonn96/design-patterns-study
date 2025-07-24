export class PaymentService {
  process(orderId: string, amount: number) {
    // Simulate payment processing logic
    console.log(
      `Processing payment for order ID: ${orderId} with value: ${amount}`
    );
    return "payment-processed";
  }
}
