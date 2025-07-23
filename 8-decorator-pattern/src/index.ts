import { DiscountDecorator } from "./decorators/discount-decorator";
import { TaxDecorator } from "./decorators/tax-decorator";
import { BasicOrder } from "./services/basic-order";

function main() {
  const basicOrder = new BasicOrder("Livro", 50);
  console.log(
    "Pedido Básico: ",
    basicOrder.getDescription(),
    "-R$",
    basicOrder.getPrice().toFixed(2)
  );

  const orderWithDiscount = new DiscountDecorator(basicOrder, 10);
  console.log(
    "Com Descounto: ",
    orderWithDiscount.getDescription(),
    "-R$",
    orderWithDiscount.getPrice().toFixed(2)
  );

  const orderWithTax = new TaxDecorator(orderWithDiscount, 5);
  console.log(
    "Com Imposto: ",
    orderWithTax.getDescription(),
    "-R$",
    orderWithTax.getPrice().toFixed(2)
  );
}

main();
