export class Order {
  constructor(
    public id: string,
    public amount: number,
    public status: string = "pending"
  ) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
    if (!id) throw new Error("Order ID is required");
  }

  complete(): void {
    this.status = "completed";
  }
}
