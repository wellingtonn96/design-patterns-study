// src/services/sms-notifier.ts
import { Observer } from "../interfaces/observer.interface";

export class SmsNotifier implements Observer {
  update(status: string): void {
    console.log(`Enviando SMS: Status do pedido atualizado para ${status}`);
  }
}
