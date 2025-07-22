// Classe que representa um pedido
export class Order {
  private uuid: string; // Identificador único do pedido
  private items: string[]; // Lista de itens do pedido
  private total: number; // Valor total do pedido
  private status: "open" | "closed"; // Status do pedido

  // Construtor recebe o uuid e um valor inicial opcional
  constructor({ uuid, amount }: { uuid: string; amount?: number }) {
    this.uuid = uuid;
    this.items = [];
    this.total = amount || 0;
    this.status = "open";
  }

  // Adiciona um item ao pedido e soma o preço ao total
  addItem(item: string, price: number): void {
    this.items.push(item); // Corrigido: adicionar o item ao array
    this.total += price;
  }

  // Remove um item do pedido e subtrai o preço do total
  removeItem(item: string, price: number): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      this.total -= price;
    }
  }

  // Retorna o valor total do pedido
  getTotal(): number {
    return this.total;
  }

  // Retorna uma cópia da lista de itens
  getItems(): string[] {
    return [...this.items];
  }

  // Fecha o pedido
  closeOrder(): void {
    this.status = "closed";
  }

  // Retorna o status atual do pedido
  getStatus(): "open" | "closed" {
    return this.status;
  }
}
