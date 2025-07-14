/**
 * 📦 ENTIDADE DE DOMÍNIO - Domain-Driven Design (DDD)
 * 
 * A classe Order representa uma entidade de domínio com identidade única.
 * Contém a lógica de negócio relacionada a pedidos e seus itens.
 * 
 * Características:
 * - Tem identidade única (id)
 * - Encapsula regras de negócio
 * - Mantém consistência interna
 * - É imutável em aspectos críticos
 */

/**
 * Representa um item individual dentro de um pedido
 */
export class OrderItem {
  constructor(
    public id: string,           // Identificador único do item
    public productId: string,    // ID do produto
    public price: number,        // Preço unitário
    public quantity: number      // Quantidade
  ) {}
}

/**
 * Representa um pedido completo no sistema
 */
export class Order {
  constructor(
    public id: string,                    // Identificador único do pedido
    public customerId: string,            // ID do cliente
    public items: OrderItem[],           // Lista de itens do pedido
    public total: number,                // Valor total do pedido
    public createdAt: Date = new Date(), // Data de criação
    public updatedAt: Date = new Date()  // Data da última atualização
  ) {}

  /**
   * Adiciona um item ao pedido
   * @param item - Item a ser adicionado
   */
  addItem(item: OrderItem): void {
    this.items.push(item);
    this.calculateTotal();        // Recalcula o total automaticamente
    this.updatedAt = new Date();  // Atualiza timestamp
  }

  /**
   * Remove um item do pedido pelo ID
   * @param itemId - ID do item a ser removido
   */
  removeItem(itemId: string): void {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.calculateTotal();        // Recalcula o total automaticamente
    this.updatedAt = new Date();  // Atualiza timestamp
  }

  /**
   * Calcula o valor total do pedido baseado nos itens
   * Método privado para encapsular a lógica de cálculo
   */
  private calculateTotal(): void {
    this.total = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
}
