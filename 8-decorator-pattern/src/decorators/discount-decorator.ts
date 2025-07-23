import { OrderComponent } from "../interface/order-component.interface";

export class DiscountDecorator implements OrderComponent {
  constructor(
    private wrapped: OrderComponent,
    private discountPercentage: number
  ) {}

  getPrice(): number {
    const originalPrice = this.wrapped.getPrice();
    return originalPrice * (1 - this.discountPercentage / 100);
  }
  getDescription(): string {
    return `${this.wrapped.getDescription()} with ${
      this.discountPercentage
    }% discount`;
  }
}
