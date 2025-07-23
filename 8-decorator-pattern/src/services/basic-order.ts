import { OrderComponent } from "../interface/order-component.interface";

export class BasicOrder implements OrderComponent {
  constructor(private item: string, private basePrice: number) {}

  getPrice(): number {
    return this.basePrice;
  }

  getDescription(): string {
    return `Order: ${this.item}, Price: ${this.basePrice}`;
  }
}
