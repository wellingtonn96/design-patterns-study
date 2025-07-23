import { OrderComponent } from "../interface/order-component.interface";

export class TaxDecorator implements OrderComponent {
  constructor(private wrapped: OrderComponent, private taxRate: number) {}

  getPrice(): number {
    const originalPrice = this.wrapped.getPrice();
    return originalPrice * (1 + this.taxRate / 100);
  }

  getDescription(): string {
    return `${this.wrapped.getDescription()} + ${this.taxRate}% tax`;
  }
}
