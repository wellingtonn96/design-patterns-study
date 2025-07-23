// src/tests/payment-proxy.test.ts
import { PaymentProxy } from "../services/payment-proxy";
import { RealOrderProcessorPayment } from "../services/real-payment-processor";
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

describe("PaymentProxy", () => {
  let realProcessor: IPaymentGateway;
  let adminProxy: PaymentProxy;
  let guestProxy: PaymentProxy;

  beforeEach(() => {
    realProcessor = new RealOrderProcessorPayment();
    jest.spyOn(realProcessor, "processPayment");
    adminProxy = new PaymentProxy(realProcessor, "admin");
    guestProxy = new PaymentProxy(realProcessor, "guest");
  });

  test("deve processar pagamento para admin", () => {
    const result = adminProxy.processPayment(100, "order123");
    expect(realProcessor.processPayment).toHaveBeenCalledWith(100, "order123");
    expect(result).toEqual(expect.objectContaining({ status: "success" }));
  });

  test("deve usar cache para chamadas repetidas", () => {
    adminProxy.processPayment(100, "order123");
    adminProxy.processPayment(100, "order123");
    expect(realProcessor.processPayment).toHaveBeenCalledTimes(1); // Cache usado
  });

  test("deve bloquear acesso para não-admin", () => {
    expect(() => guestProxy.processPayment(100, "order123")).toThrow(
      "Acesso negado"
    );
  });
});
