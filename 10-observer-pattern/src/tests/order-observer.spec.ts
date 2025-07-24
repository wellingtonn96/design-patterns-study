import { Order } from "../models/order";
import { EmailNotifier } from "../services/email-notifier";
import { OrderSubject } from "../services/order-subject";
import { SmsNotifier } from "../services/sms-notifier";

describe("OrderSubject", () => {
  let order: Order;
  let orderSubject: OrderSubject;
  let emailNotifier: EmailNotifier;
  let smsNotifier: SmsNotifier;
  beforeEach(() => {
    order = new Order("12345", 100);
    orderSubject = new OrderSubject(order);
    emailNotifier = new EmailNotifier();
    smsNotifier = new SmsNotifier();
    jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve notificar observadores ao mudar status", () => {
    orderSubject.addObserver(emailNotifier);
    orderSubject.addObserver(smsNotifier);

    orderSubject.setStatus("shipped");

    expect(console.log).toHaveBeenCalledWith(
      "Email notification sent: Order status changed to shipped"
    );
    expect(console.log).toHaveBeenCalledWith(
      "Enviando SMS: Status do pedido atualizado para shipped"
    );
  });
  it("deve remover observadores corretamente", () => {
    orderSubject.addObserver(emailNotifier);
    orderSubject.addObserver(smsNotifier);

    orderSubject.removeObserver(smsNotifier);
    orderSubject.setStatus("delivered");

    expect(console.log).toHaveBeenCalledWith(
      "Email notification sent: Order status changed to delivered"
    );
    expect(console.log).not.toHaveBeenCalledWith(
      "Enviando SMS: Status do pedido atualizado para delivered"
    );
  });
});
