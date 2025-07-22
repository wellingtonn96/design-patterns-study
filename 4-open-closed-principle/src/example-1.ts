// Exemplo que viola o OCP (Open/Closed Principle) do SOLID
// O OCP diz que classes devem ser abertas para extensão, mas fechadas para modificação.
// Aqui, toda vez que um novo tipo de desconto é necessário, a classe Order precisa ser modificada, violando o princípio.
class Order {
  private amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  // Método para desconto fixo
  applyDiscount(discount: number): void {
    this.amount -= discount;
  }

  // Método para desconto percentual
  // Se for necessário um novo tipo de desconto, seria preciso adicionar outro método aqui,
  // modificando a classe e violando o OCP.
  applyPorcentageDiscount(percentage: number): void {
    if (percentage < 0 || percentage > 100) {
      throw new Error("Percentage must be between 0 and 100");
    }
    this.amount -= (this.amount * percentage) / 100;
  }

  getAmount(): number {
    return this.amount;
  }
}

// Função principal de exemplo que mostra o uso da classe que viola o OCP
export function mainWrong() {
  const order = new Order(100);
  console.log("Initial amount:", order.getAmount());

  order.applyDiscount(10);
  console.log("After applying flat discount of 10:", order.getAmount());

  order.applyPorcentageDiscount(20);
  console.log("After applying percentage discount of 20%:", order.getAmount());
}
