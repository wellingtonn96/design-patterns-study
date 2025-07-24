export class ShippingService {
  process(orderId: string, amount: number) {
    // Simulate shipping processing logic
    console.log(
      `Processing shipping for order ID: ${orderId} with value: ${amount}`
    );
    return "shipping-processed";
  }
}
