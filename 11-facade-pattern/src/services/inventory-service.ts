export class InventoryService {
  process(orderId: string, amount: number) {
    // Simulate inventory processing logic
    console.log(
      `Processing inventory for order ID: ${orderId} with value: ${amount}`
    );
    return "inventory-updated";
  }
}
