import { Order } from "./models/order";
import { OrderSubject } from "./services/order-subject";
import { EmailNotifier } from "./services/email-notifier";
import { SmsNotifier } from "./services/sms-notifier";

function main() {
  console.log("Observer Pattern Example");

  const order = new Order("12345", 100);
  const orderSubject = new OrderSubject(order);

  const emailNotifier = new EmailNotifier();
  const smsNotifier = new SmsNotifier();

  orderSubject.addObserver(emailNotifier);
  orderSubject.addObserver(smsNotifier);

  console.log("Status inicial:", order.status);
  orderSubject.setStatus("shipped");
  orderSubject.removeObserver(smsNotifier);
  orderSubject.setStatus("delivered");
}

main();
