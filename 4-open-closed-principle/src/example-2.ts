// Exemplo que segue o OCP (Open/Closed Principle) do SOLID
// O OCP diz que classes devem ser abertas para extensão, mas fechadas para modificação.
// Aqui, novos tipos de desconto podem ser adicionados sem modificar a classe OrderExample2.
// Também é aplicado o padrão de projeto Strategy, pois o comportamento de desconto é injetado via interface.

// Interface para descontos, permitindo extensão sem modificar clientes
interface DiscountInterface {
  apply(orderAmount: number): number;
}

// Implementação de desconto fixo
class FixedDiscount implements DiscountInterface {
  private discount: number;

  constructor(discount: number) {
    this.discount = discount;
  }

  apply(orderAmount: number): number {
    return orderAmount - this.discount;
  }
}

// Implementação de desconto percentual
class PercentageDiscount implements DiscountInterface {
  private percentage: number;

  constructor(percentage: number) {
    this.percentage = percentage;
  }

  apply(orderAmount: number): number {
    if (this.percentage < 0 || this.percentage > 100) {
      throw new Error("Percentage must be between 0 and 100");
    }
    return orderAmount - (orderAmount * this.percentage) / 100;
  }
}

// Classe Order que utiliza o padrão Strategy para aplicar descontos
class OrderExample2 {
  private amount: number;
  private discount: DiscountInterface | null;

  constructor(amount: number, discount: DiscountInterface | null) {
    this.amount = amount;
    this.discount = discount;
  }

  // Permite trocar a estratégia de desconto em tempo de execução
  setDiscount(discount: DiscountInterface): void {
    this.discount = discount;
  }

  // Calcula o valor com desconto usando a estratégia definida
  getAmount(): number {
    if (this.discount) {
      return this.discount.apply(this.amount);
    }
    return this.amount;
  }
}

// Função principal de exemplo que mostra o uso da classe que segue o OCP e aplica o padrão Strategy
export function mainRefactored() {
  const order = new OrderExample2(100, null);
  console.log("Initial amount:", order.getAmount());

  order.setDiscount(new FixedDiscount(10));
  console.log("After applying flat discount of 10:", order.getAmount());

  order.setDiscount(new PercentageDiscount(20));
  console.log("After applying percentage discount of 20%:", order.getAmount());
}
