# Princípio OCP (Open/Closed Principle) e Padrão Strategy

Este projeto demonstra a aplicação do **Princípio Aberto/Fechado (OCP)**, um dos pilares do SOLID, e o **Padrão de Projeto Strategy** usando TypeScript. O objetivo é mostrar como tornar o código extensível e manutenível, evitando modificações em classes existentes ao adicionar novos comportamentos.

## O que é o OCP?

O **Open/Closed Principle (OCP)** afirma que **as classes devem estar abertas para extensão, mas fechadas para modificação**. Isso significa que você pode adicionar novas funcionalidades (extensão) sem alterar o código existente (modificação).

**Analogia**: Imagine uma caixa de brinquedos com uma tampa. Você pode adicionar novos brinquedos (extensão) sem precisar quebrar ou reconstruir a caixa (modificação). O OCP funciona assim: novas funcionalidades são adicionadas criando novas classes ou implementações, sem alterar as classes originais.

## O que é o Padrão Strategy?

O **Padrão Strategy** permite definir uma família de algoritmos (estratégias), encapsulá-los em classes separadas e torná-los intercambiáveis. Ele usa interfaces ou classes abstratas para definir um contrato, permitindo que diferentes implementações sejam usadas sem modificar o código que as consome.

**Analogia**: Pense em um carrinho de controle remoto que aceita diferentes tipos de pilhas (comum, recarregável ou bateria especial). O carrinho funciona com qualquer pilha que siga o mesmo encaixe, sem precisar ser desmontado para trocar a fonte de energia.

## Exemplo Prático

Este projeto contém dois exemplos em TypeScript:

1. Uma implementação que **viola o OCP** (`src/example-1.ts`).
2. Uma implementação refatorada que **respeita o OCP** usando o Padrão Strategy (`src/example-2.ts`).

### Exemplo 1: Violando o OCP (`src/example-1.ts`)

Neste exemplo, a classe `Order` contém a lógica de descontos diretamente, o que viola o OCP, pois adicionar um novo tipo de desconto exige modificar a classe.

```typescript
class Order {
  private amount: number;

  constructor(amount: number) {
    if (amount < 0) {
      throw new Error("Valor do pedido deve ser maior ou igual a zero");
    }
    this.amount = amount;
  }

  applyFixedDiscount(discount: number): void {
    if (discount < 0 || discount > this.amount) {
      throw new Error("Desconto inválido ou maior que o valor do pedido");
    }
    this.amount -= discount;
  }

  applyPercentageDiscount(percentage: number): void {
    if (percentage <= 0 || percentage > 100) {
      throw new Error("Percentual deve estar entre 1 e 100");
    }
    this.amount -= (this.amount * percentage) / 100;
  }

  getAmount(): number {
    return this.amount;
  }
}

// Uso
const order = new Order(100);
order.applyFixedDiscount(10); // Desconto fixo de 10
console.log(order.getAmount()); // Output: 90
order.applyPercentageDiscount(20); // Desconto de 20%
console.log(order.getAmount()); // Output: 72
```

**Problemas**:

- **Viola o OCP**: Adicionar um novo tipo de desconto (ex.: desconto condicional) exige modificar a classe `Order` com um novo método.
- **Viola o SRP (Single Responsibility Principle)**: A classe `Order` é responsável por gerenciar pedidos e calcular descontos, o que não é sua responsabilidade.
- **Falta rastreabilidade**: Não há uma representação clara dos descontos, dificultando relatórios ou persistência.
- **Alto acoplamento**: A lógica de desconto está embutida, tornando a classe dependente de implementações concretas.

---

### Exemplo 2: Respeitando o OCP com Padrão Strategy (`src/example-2.ts`)

Na refatoração, usamos o **Padrão Strategy** para encapsular a lógica de descontos em classes separadas que implementam uma interface `DiscountInterface`. Isso torna a classe `Order` extensível sem modificação.

```typescript
// Interface que define o contrato para descontos
interface DiscountInterface {
  apply(orderAmount: number): number;
}

// Desconto fixo
class FixedDiscount implements DiscountInterface {
  constructor(private value: number) {
    if (value < 0) {
      throw new Error("Desconto não pode ser negativo");
    }
  }

  apply(orderAmount: number): number {
    if (this.value > orderAmount) {
      throw new Error("Desconto maior que o valor do pedido");
    }
    return orderAmount - this.value;
  }
}

// Desconto percentual
class PercentageDiscount implements DiscountInterface {
  constructor(private percentage: number) {
    if (percentage <= 0 || percentage > 100) {
      throw new Error("Percentual deve estar entre 1 e 100");
    }
  }

  apply(orderAmount: number): number {
    return orderAmount - (orderAmount * this.percentage) / 100;
  }
}

// Classe Order refatorada
class Order {
  private amount: number;
  private discount: DiscountInterface | null;

  constructor(amount: number, discount: DiscountInterface | null = null) {
    if (amount < 0) {
      throw new Error("Valor do pedido deve ser maior ou igual a zero");
    }
    this.amount = amount;
    this.discount = discount;
  }

  setDiscount(discount: DiscountInterface): void {
    this.discount = discount;
  }

  getAmount(): number {
    if (this.discount) {
      return this.discount.apply(this.amount);
    }
    return this.amount;
  }
}

// Uso
const order1 = new Order(100, new FixedDiscount(10));
console.log(order1.getAmount()); // Output: 90

const order2 = new Order(100);
order2.setDiscount(new PercentageDiscount(20));
console.log(order2.getAmount()); // Output: 80
```

**Benefícios**:

- **Respeita o OCP**: Novos descontos podem ser adicionados criando classes que implementam `DiscountInterface`, sem modificar `Order`.
- **Respeita o SRP**: A lógica de desconto é separada da gestão de pedidos.
- **Respeita o DIP (Dependency Inversion Principle)**: `Order` depende da abstração `DiscountInterface`, não de implementações concretas.
- **Respeita o ISP (Interface Segregation Principle)**: A interface `DiscountInterface` é pequena e específica.
- **Rastreabilidade**: Cada desconto é uma entidade própria, facilitando relatórios e persistência.

---

## Como Executar o Projeto

1. **Pré-requisitos**:

   - Node.js (versão 16 ou superior)
   - TypeScript instalado globalmente (`npm install -g typescript`)

2. **Instalação**:

   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-repositorio>
   npm install
   ```

3. **Compilação e Execução**:

   - Para executar o exemplo que viola o OCP:
     ```bash
     tsc src/example-1.ts
     node src/example-1.js
     ```
   - Para executar o exemplo refatorado:
     ```bash
     tsc src/example-2.ts
     node src/example-2.js
     ```

4. **Estrutura do Projeto**:
   ```
   .
   ├── src/
   │   ├── example-1.ts  # Código que viola o OCP
   │   ├── example-2.ts  # Código refatorado com OCP e Strategy
   ├── package.json
   └── README.md
   ```

---

## Resumo

- **OCP**: Permite adicionar novos comportamentos (como novos descontos) sem modificar o código existente, como uma caixa de brinquedos que aceita novos itens sem ser quebrada.
- **Padrão Strategy**: Encapsula comportamentos intercambiáveis (como diferentes tipos de desconto) em classes separadas, permitindo trocá-los facilmente, como pilhas em um carrinho de controle remoto.
- **Benefícios**: Código mais flexível, manutenível, testável e com baixo acoplamento, alinhado com os princípios SOLID.

---

> **Dica**: Para tornar seu código mais robusto, pense sempre em como adicionar novos comportamentos sem mexer no que já funciona. Use interfaces e injeção de dependência, como neste projeto, para manter seu sistema como uma caixa de brinquedos pronta para novas aventuras!
