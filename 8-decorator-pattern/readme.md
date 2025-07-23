# 🎨 Padrão de Design Decorator: o padrão de design que torna seu código mais flexível com orientação a objetos...

Este projeto explora o **Padrão de Design Decorator** em um sistema de pedidos, usando **TypeScript**. O Decorator permite adicionar comportamentos a objetos dinamicamente, sem modificar sua estrutura original, promovendo flexibilidade e conformidade com princípios de orientação a objetos. Este README detalha o padrão, sua implementação, benefícios e riscos, com exemplos práticos e testes.

## 🎯 Objetivo

O objetivo é:

- Demonstrar como o Decorator adiciona funcionalidades (ex.: descontos, impostos) a um componente base.
- Mostrar como ele segue o princípio **OCP** (aberto para extensão, fechado para modificação).
- Conectar o padrão aos princípios SOLID (SRP, OCP, DIP, ISP) dos projetos anteriores.
- Fornecer testes unitários para validar o comportamento.
- Oferecer uma alternativa prática para extensibilidade.

## 📚 Conceito Principal

### Padrão Decorator

- **Definição**: Permite adicionar responsabilidades a objetos dinamicamente, encapsulando-os em objetos decoradores que implementam a mesma interface.
- **Analogia**: Pense em uma equipe de especialistas. Um cozinheiro base (componente) pode ser "decorado" com um chef de sobremesas ou um sommelier, adicionando habilidades sem alterar o cozinheiro original.
- **Benefícios**:
  - Flexibilidade para adicionar ou remover funcionalidades em tempo de execução.
  - Conformidade com **OCP** ao evitar modificações na classe base.
- **Riscos**: Sobrecarga de objetos e complexidade se usado excessivamente.

### Conexão com SOLID

- **Single Responsibility Principle (SRP)**: Cada decorador tem uma responsabilidade específica (ex.: aplicar desconto).
- **Open/Closed Principle (OCP)**: Novas funcionalidades são adicionadas por novos decoradores, sem alterar o componente base.
- **Dependency Inversion Principle (DIP)**: Depende de abstrações (interface) em vez de implementações concretas.
- **Interface Segregation Principle (ISP)**: A interface é enxuta, contendo apenas métodos necessários.

## 📁 Estrutura do Projeto

```
src/
├── interfaces/
│   └── order-component.interface.ts    # 🔌 Interface base
├── models/
│   └── order.ts                       # 📦 Entidade de pedido
├── decorators/
│   ├── discount-decorator.ts          # 💰 Decorador de desconto
│   └── tax-decorator.ts               # 💸 Decorador de imposto
├── services/
│   └── basic-order.ts                 # 📋 Componente base
├── tests/
│   └── order-decorator.test.ts        # 🧪 Testes unitários
└── index.ts                           # 📖 Ponto de entrada
package.json                           # 📦 Configurações do projeto
tsconfig.json                          # ⚙️ Configurações TypeScript
README.md                              # 📜 Documentação
```

## 🔍 Como Funciona

### 1. Interface Base

```typescript
// src/interfaces/order-component.interface.ts
export interface OrderComponent {
  getPrice(): number;
  getDescription(): string;
}
```

### 2. Componente Base

```typescript
// src/services/basic-order.ts
import { OrderComponent } from "../interfaces/order-component.interface";

export class BasicOrder implements OrderComponent {
  constructor(private item: string, private basePrice: number) {}

  getPrice(): number {
    return this.basePrice;
  }

  getDescription(): string {
    return `${this.item} (R$${this.basePrice.toFixed(2)})`;
  }
}
```

### 3. Decoradores

```typescript
// src/decorators/discount-decorator.ts
import { OrderComponent } from "../interfaces/order-component.interface";

export class DiscountDecorator implements OrderComponent {
  constructor(
    private wrapped: OrderComponent,
    private discountPercentage: number
  ) {}

  getPrice(): number {
    const originalPrice = this.wrapped.getPrice();
    return originalPrice * (1 - this.discountPercentage / 100);
  }

  getDescription(): string {
    return `${this.wrapped.getDescription()} com ${
      this.discountPercentage
    }% de desconto`;
  }
}
```

```typescript
// src/decorators/tax-decorator.ts
import { OrderComponent } from "../interfaces/order-component.interface";

export class TaxDecorator implements OrderComponent {
  constructor(private wrapped: OrderComponent, private taxRate: number) {}

  getPrice(): number {
    const originalPrice = this.wrapped.getPrice();
    return originalPrice * (1 + this.taxRate / 100);
  }

  getDescription(): string {
    return `${this.wrapped.getDescription()} + ${this.taxRate}% de imposto`;
  }
}
```

### 4. Ponto de Entrada

```typescript
// src/index.ts
import { BasicOrder } from "./services/basic-order";
import { DiscountDecorator } from "./decorators/discount-decorator";
import { TaxDecorator } from "./decorators/tax-decorator";

function main() {
  const basicOrder = new BasicOrder("Livro", 50);
  console.log(
    "Pedido Básico:",
    basicOrder.getDescription(),
    "- R$",
    basicOrder.getPrice().toFixed(2)
  );

  const orderWithDiscount = new DiscountDecorator(basicOrder, 10);
  console.log(
    "Com Desconto:",
    orderWithDiscount.getDescription(),
    "- R$",
    orderWithDiscount.getPrice().toFixed(2)
  );

  const orderWithTax = new TaxDecorator(orderWithDiscount, 5);
  console.log(
    "Com Imposto:",
    orderWithTax.getDescription(),
    "- R$",
    orderWithTax.getPrice().toFixed(2)
  );
}

main();
```

## ✅ Benefícios Demonstrados

- **Flexibilidade**: Adicione descontos ou impostos sem alterar `BasicOrder`.
- **OCP**: Novos decoradores (ex.: frete) podem ser criados sem modificar o código existente.
- **Reutilização**: Decoradores podem ser combinados em qualquer ordem.

## 🧪 Testes Unitários

```typescript
// src/tests/order-decorator.test.ts
import { BasicOrder } from "../services/basic-order";
import { DiscountDecorator } from "../decorators/discount-decorator";
import { TaxDecorator } from "../decorators/tax-decorator";

describe("OrderDecorator", () => {
  let basicOrder: BasicOrder;

  beforeEach(() => {
    basicOrder = new BasicOrder("Livro", 50);
  });

  test("deve retornar preço base", () => {
    expect(basicOrder.getPrice()).toBe(50);
    expect(basicOrder.getDescription()).toBe("Livro (R$50.00)");
  });

  test("deve aplicar desconto corretamente", () => {
    const orderWithDiscount = new DiscountDecorator(basicOrder, 10);
    expect(orderWithDiscount.getPrice()).toBe(45); // 50 * (1 - 0.10)
    expect(orderWithDiscount.getDescription()).toContain("10% de desconto");
  });

  test("deve aplicar imposto corretamente", () => {
    const orderWithTax = new TaxDecorator(basicOrder, 5);
    expect(orderWithTax.getPrice()).toBe(52.5); // 50 * (1 + 0.05)
    expect(orderWithTax.getDescription()).toContain("5% de imposto");
  });

  test("deve combinar desconto e imposto", () => {
    const orderWithDiscount = new DiscountDecorator(basicOrder, 10);
    const orderWithTax = new TaxDecorator(orderWithDiscount, 5);
    expect(orderWithTax.getPrice()).toBe(47.25); // 45 * (1 + 0.05)
    expect(orderWithTax.getDescription()).toContain("10% de desconto");
    expect(orderWithTax.getDescription()).toContain("5% de imposto");
  });
});
```

### Como Executar Testes

```bash
npm install --save-dev jest ts-jest @types/jest
npx jest --init
npm test
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v16 ou superior)
- TypeScript (`npm install -g typescript`)
- Jest (`npm install --save-dev jest ts-jest @types/jest`)

### Instalação

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
npm install
```

### Compilação e Execução

- Compilar:
  ```bash
  npm run build
  ```
- Executar exemplos:
  ```bash
  npm start
  ```
- Testes:
  ```bash
  npm test
  ```

### `package.json`

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

## 📖 Extensibilidade

### Adicionar Novo Decorador (Frete)

```typescript
// src/decorators/shipping-decorator.ts
import { OrderComponent } from "../interfaces/order-component.interface";

export class ShippingDecorator implements OrderComponent {
  constructor(private wrapped: OrderComponent, private shippingCost: number) {}

  getPrice(): number {
    return this.wrapped.getPrice() + this.shippingCost;
  }

  getDescription(): string {
    return `${this.wrapped.getDescription()} + R$${this.shippingCost.toFixed(
      2
    )} de frete`;
  }
}
```

### Uso

```typescript
const orderWithShipping = new ShippingDecorator(orderWithTax, 10);
console.log(
  "Com Frete:",
  orderWithShipping.getDescription(),
  "- R$",
  orderWithShipping.getPrice().toFixed(2)
);
```

## 📚 Conceitos Aplicados

- **Decorator**: Adiciona funcionalidades dinamicamente via composição.
- **SRP**: Cada decorador tem uma responsabilidade (desconto, imposto).
- **OCP**: Novas funcionalidades são extensíveis com novos decoradores.
- **DIP**: Usa a interface `OrderComponent` como abstração.
- **ISP**: A interface é minimalista, contendo apenas métodos essenciais.

## 🎓 Aprendizados

1. **Flexibilidade**: Decorator permite adicionar comportamentos sem herança rígida.
2. **Manutenibilidade**: Segue OCP, facilitando extensões.
3. **Testabilidade**: Decoradores são fáceis de testar isoladamente.

## 🔄 Próximos Passos

- [ ] Adicionar decorador de embalagem premium.
- [ ] Implementar cache de decoradores para otimização.
- [ ] Integrar com o sistema de pagamentos (DIP).

---

**💡 Dica**: O Decorator é como uma equipe de especialistas trabalhando juntos. Cada membro (decorador) adiciona valor ao cozinheiro base (componente), tornando o sistema mais adaptável sem mudanças estruturais!
