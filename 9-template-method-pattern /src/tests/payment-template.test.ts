import { Order } from "../models/order";
import { CreditPayment } from "../services/credit-payment";
import { DebitPayment } from "../services/debit-payment";

describe("PaymentTemplate", () => {
  let order: Order;
  let creditPayment: CreditPayment;
  let debitPayment: DebitPayment;

  beforeEach(() => {
    order = new Order("order123", 100);
    creditPayment = new CreditPayment();
    debitPayment = new DebitPayment();
  });

  it("should process credit payment successfully", () => {
    const result = creditPayment.processPayment(order);
    expect(result).toHaveProperty("transactionId");
    expect(result.status).toBe("success");
  });

  it("should process debit payment successfully", () => {
    const result = debitPayment.processPayment(order);
    expect(result).toHaveProperty("transactionId");
    expect(result.status).toBe("success");
  });

  it("should throw error for invalid order amount", () => {
    order.amount = -50;
    expect(() => creditPayment.processPayment(order)).toThrow(
      "Valor inválido para pagamento"
    );
  });
});
