import { Observer } from "../interfaces/observer.interface";

export class EmailNotifier implements Observer {
  update(status: string): void {
    console.log(`Email notification sent: Order status changed to ${status}`);
  }
}
