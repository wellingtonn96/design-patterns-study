import { Observer } from "../interfaces/observer.interface";
import { Order } from "../models/order";

export class OrderSubject {
  private observers: Observer[] = [];
  private order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) this.observers.splice(index, 1);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.order.status);
    }
  }

  setStatus(status: string): void {
    this.order.status = status;
    this.notify();
  }
}
