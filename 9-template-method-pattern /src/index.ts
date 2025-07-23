import { Order } from "./models/order";
import { CreditPayment } from "./services/credit-payment";

function main() {
  const order = new Order("order123", 100);

  const creditPayment = new CreditPayment();
  console.log(
    "Processing credit payment...",
    creditPayment.processPayment(order)
  );

  const debitPayment = new CreditPayment();
  console.log(
    "Processing debit payment...",
    debitPayment.processPayment(order)
  );
}

main();
