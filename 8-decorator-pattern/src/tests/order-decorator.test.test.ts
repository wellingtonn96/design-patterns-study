import { DiscountDecorator } from "../decorators/discount-decorator";
import { TaxDecorator } from "../decorators/tax-decorator";
import { BasicOrder } from "../services/basic-order";

describe("OrderDecorator", () => {
  let basicOrder: BasicOrder;

  beforeEach(() => {
    basicOrder = new BasicOrder("Livro", 50);
  });

  test("Deve retornar o preço base", () => {
    expect(basicOrder.getPrice()).toBe(50);
    expect(basicOrder.getDescription()).toBe("Order: Livro, Price: 50");
  });
  test("Deve aplicar desconto corretamente", () => {
    const orderWithDiscount = new DiscountDecorator(basicOrder, 10);
    expect(orderWithDiscount.getPrice()).toBe(45);
    expect(orderWithDiscount.getDescription()).toContain("with 10% discount");
  });
  test("deve aplicar imposto corretamente", () => {
    const orderWithTax = new TaxDecorator(basicOrder, 5);
    expect(orderWithTax.getPrice()).toBe(52.5);
    expect(orderWithTax.getDescription()).toContain(" + 5% tax");
  });
  test("deve combinar desconto e imposto", () => {
    const orderWithDiscount = new DiscountDecorator(basicOrder, 10);
    const orderWithTax = new TaxDecorator(orderWithDiscount, 5);
    expect(orderWithTax.getPrice()).toBe(47.25); // 45 * (1 + 0.05)
    expect(orderWithTax.getDescription()).toContain(
      "with 10% discount + 5% tax"
    );
    expect(orderWithTax.getDescription()).toContain("Order: Livro, Price: 50");
  });
});
