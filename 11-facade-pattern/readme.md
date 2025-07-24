# 🏛️ Padrão de Projeto Facade: O Design Pattern Que Simplifica Código Complexo com Orientação a Objetos!

Este projeto explora o **Padrão de Projeto Facade** em um sistema de processamento de pedidos, usando **TypeScript**. O Facade fornece uma interface simplificada para um conjunto de subsistemas complexos, reduzindo a complexidade e promovendo um design orientado a objetos. Este README detalha o padrão, sua implementação, benefícios e riscos, com exemplos práticos e testes.

## 🎯 Objetivo

O objetivo é:

- Demonstrar como o Facade simplifica a interação com subsistemas (pagamento, estoque, envio).
- Mostrar conformidade com o princípio **DIP** (inversão de dependências).
- Conectar o padrão aos princípios SOLID (SRP, OCP, DIP, ISP) dos projetos anteriores.
- Fornecer testes unitários para validar o comportamento.
- Oferecer uma abordagem prática para abstração.

## 📚 Conceito Principal

### Padrão Facade

- **Definição**: Fornece uma interface unificada e de alto nível que simplifica o acesso a um conjunto de subsistemas complexos.
- **Analogia**: Imagine uma equipe de especialistas com um gerente (facade). Em vez de lidar com cada especialista individualmente, você interage apenas com o gerente, que coordena tudo.
- **Benefícios**:
  - Reduz complexidade ao esconder detalhes de implementação.
  - Facilita a manutenção e o uso por clientes.
- **Riscos**: Pode se tornar um ponto único de falha se não for bem projetado.

### Conexão com SOLID

- **Single Responsibility Principle (SRP)**: A facade tem a responsabilidade de coordenar subsistemas.
- **Open/Closed Principle (OCP)**: Novos subsistemas podem ser integrados sem alterar a facade (via injeção).
- **Dependency Inversion Principle (DIP)**: Depende de abstrações (interfaces) em vez de implementações concretas.
- **Interface Segregation Principle (ISP)**: A interface da facade é específica e minimalista.

## 📁 Estrutura do Projeto

```
src/
├── interfaces/
│   └── order-system.interface.ts      # 🔌 Interface de subsistema
├── models/
│   └── order.ts                       # 📦 Entidade de pedido
├── services/
│   ├── payment-service.ts             # 💳 Subsistema de pagamento
│   ├── inventory-service.ts           # 📦 Subsistema de estoque
│   ├── shipping-service.ts            # 🚚 Subsistema de envio
│   └── order-facade.ts                # 🏛️ Facade principal
├── tests/
│   └── order-facade.test.ts           # 🧪 Testes unitários
└── index.ts                           # 📖 Ponto de entrada
package.json                           # 📦 Configurações do projeto
tsconfig.json                          # ⚙️ Configurações TypeScript
README.md                              # 📜 Documentação
```

## 🔍 Como Funciona

### 1. Interface de Subsistema

```typescript
// src/interfaces/order-system.interface.ts
export interface OrderSystem {
  process(orderId: string, amount: number): string;
}
```

### 2. Modelo de Domínio

```typescript
// src/models/order.ts
export class Order {
  constructor(
    public id: string,
    public amount: number,
    public status: string = "pending"
  ) {
    if (amount < 0) throw new Error("Valor inválido");
    if (!id) throw new Error("ID obrigatório");
  }

  complete(): void {
    this.status = "completed";
  }
}
```

### 3. Subsistemas

```typescript
// src/services/payment-service.ts
import { OrderSystem } from "../interfaces/order-system.interface";

export class PaymentService implements OrderSystem {
  process(orderId: string, amount: number): string {
    console.log(
      `Processando pagamento de R$${amount.toFixed(2)} para o pedido ${orderId}`
    );
    return `txn_${Date.now()}`;
  }
}
```

```typescript
// src/services/inventory-service.ts
import { OrderSystem } from "../interfaces/order-system.interface";

export class InventoryService implements OrderSystem {
  process(orderId: string, amount: number): string {
    console.log(
      `Atualizando estoque para o pedido ${orderId} com valor R$${amount.toFixed(
        2
      )}`
    );
    return "inventory_updated";
  }
}
```

```typescript
// src/services/shipping-service.ts
import { OrderSystem } from "../interfaces/order-system.interface";

export class ShippingService implements OrderSystem {
  process(orderId: string, amount: number): string {
    console.log(
      `Agendando envio para o pedido ${orderId} com valor R$${amount.toFixed(
        2
      )}`
    );
    return "shipping_scheduled";
  }
}
```

### 4. Facade

```typescript
// src/services/order-facade.ts
import { Order } from "../models/order";
import { OrderSystem } from "../interfaces/order-system.interface";

export class OrderFacade {
  private paymentService: OrderSystem;
  private inventoryService: OrderSystem;
  private shippingService: OrderSystem;

  constructor(
    paymentService: OrderSystem,
    inventoryService: OrderSystem,
    shippingService: OrderSystem
  ) {
    this.paymentService = paymentService;
    this.inventoryService = inventoryService;
    this.shippingService = shippingService;
  }

  processOrder(order: Order): { transactionId: string; status: string } {
    const transactionId = this.paymentService.process(order.id, order.amount);
    this.inventoryService.process(order.id, order.amount);
    this.shippingService.process(order.id, order.amount);
    order.complete();
    return { transactionId, status: "completed" };
  }
}
```

### 5. Ponto de Entrada

```typescript
// src/index.ts
import { Order } from "./models/order";
import { OrderFacade } from "./services/order-facade";
import { PaymentService } from "./services/payment-service";
import { InventoryService } from "./services/inventory-service";
import { ShippingService } from "./services/shipping-service";

function main() {
  const order = new Order("order123", 100);
  const facade = new OrderFacade(
    new PaymentService(),
    new InventoryService(),
    new ShippingService()
  );
  const result = facade.processOrder(order);
  console.log("Resultado do processamento:", result);
}

main();
```

## ✅ Benefícios Demonstrados

- **Simplicidade**: A facade abstrai a complexidade dos subsistemas.
- **DIP**: Depende de interfaces (`OrderSystem`) em vez de implementações.
- **Manutenibilidade**: Alterações nos subsistemas não afetam o cliente.

## 🧪 Testes Unitários

```typescript
// src/tests/order-facade.test.ts
import { Order } from "../models/order";
import { OrderFacade } from "../services/order-facade";
import { PaymentService } from "../services/payment-service";
import { InventoryService } from "../services/inventory-service";
import { ShippingService } from "./services/shipping-service";

describe("OrderFacade", () => {
  let facade: OrderFacade;
  let order: Order;

  beforeEach(() => {
    order = new Order("order123", 100);
    facade = new OrderFacade(
      new PaymentService(),
      new InventoryService(),
      new ShippingService()
    );
    jest.spyOn(console, "log").mockImplementation(); // Mock para logs
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("deve processar pedido completo", () => {
    const result = facade.processOrder(order);
    expect(result.status).toBe("completed");
    expect(order.status).toBe("completed");
    expect(console.log).toHaveBeenCalledWith(
      "Processando pagamento de R$100.00 para o pedido order123"
    );
    expect(console.log).toHaveBeenCalledWith(
      "Atualizando estoque para o pedido order123 com valor R$100.00"
    );
    expect(console.log).toHaveBeenCalledWith(
      "Agendando envio para o pedido order123 com valor R$100.00"
    );
  });

  test("deve falhar com valor inválido", () => {
    const invalidOrder = new Order("invalid", -1);
    expect(() => facade.processOrder(invalidOrder)).toThrow("Valor inválido");
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

### Adicionar Novo Subsistema (NotificationService)

```typescript
// src/services/notification-service.ts
import { OrderSystem } from "../interfaces/order-system.interface";

export class NotificationService implements OrderSystem {
  process(orderId: string, amount: number): string {
    console.log(
      `Enviando notificação para o pedido ${orderId} com valor R$${amount.toFixed(
        2
      )}`
    );
    return "notification_sent";
  }
}
```

### Uso

```typescript
const facade = new OrderFacade(
  new PaymentService(),
  new InventoryService(),
  new ShippingService(),
  new NotificationService()
);
```

## 📚 Conceitos Aplicados

- **Facade**: Simplifica acesso a subsistemas complexos.
- **SRP**: A facade coordena, subsistemas executam.
- **OCP**: Novos subsistemas são integráveis via injeção.
- **DIP**: Usa `OrderSystem` como abstração.
- **ISP**: Interface minimalista para subsistemas.

## 🎓 Aprendizados

1. **Simplicidade**: Reduz a complexidade para o cliente.
2. **Abstração**: Segue DIP com interfaces.
3. **Testabilidade**: Facilita mockar subsistemas.

## 🔄 Próximos Passos

- [ ] Adicionar rollback em caso de falha de subsistema.
- [ ] Implementar paralelismo nos subsistemas.
- [ ] Integrar com o sistema de observadores (DIP).

---

**💡 Dica**: O Facade é como um gerente que simplifica a interação com uma equipe de especialistas. Ele coordena tudo, permitindo que você foque no resultado, não nos detalhes!
