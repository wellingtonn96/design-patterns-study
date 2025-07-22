# 🔄 Princípio da Inversão de Dependência (DIP) + Padrão Adapter

Este projeto demonstra como o **Princípio da Inversão de Dependência (DIP)** e o **Padrão de Projeto Adapter** criam um sistema de processamento de pedidos flexível, testável e manutenível, integrado com múltiplos gateways de pagamento (Stripe, Mercado Pago e PayPal). Escrito em **TypeScript**, o código ilustra como abstrações e adaptações de interfaces permitem escalabilidade e baixo acoplamento, alinhando-se com os princípios SOLID.

## 🎯 Objetivo

O objetivo é mostrar como:

- O **DIP** reduz o acoplamento ao depender de abstrações, não de implementações concretas.
- O **Padrão Adapter** integra APIs externas com interfaces incompatíveis.
- Esses conceitos, combinados com o **Open/Closed Principle (OCP)**, permitem adicionar novos gateways sem modificar o código existente.

## 📚 Conceitos Principais

### Princípio da Inversão de Dependência (DIP)

- **Definição**: Módulos de alto nível (ex.: lógica de negócios) não devem depender de módulos de baixo nível (ex.: APIs externas). Ambos devem depender de abstrações (interfaces), e abstrações não devem depender de detalhes.
- **Analogia**: Imagine um aparelho que funciona com qualquer tomada, desde que use um adaptador padrão. O aparelho depende do formato da tomada (abstração), não de como a energia é gerada (detalhe).

### Padrão Adapter

- **Definição**: Converte interfaces incompatíveis (ex.: APIs de gateways) em uma interface comum, encapsulando a complexidade de integração.
- **Analogia**: É como um adaptador de tomada que permite usar um plugue europeu em uma tomada americana, sem alterar o aparelho.

### Conexão com SOLID

- **Open/Closed Principle (OCP)**: Semelhante ao exemplo do desconto no projeto anterior, novos gateways podem ser adicionados sem modificar `OrderProcessorService`.
- **Interface Segregation Principle (ISP)**: A interface `IPaymentGateway` é enxuta, contendo apenas o método `pay`.
- **Single Responsibility Principle (SRP)**: Cada adapter lida apenas com a integração de um gateway específico.

## 📁 Estrutura do Projeto

```
src/
├── interfaces/
│   └── payment-gateway.interface.ts    # 🔌 Interface para gateways
├── models/
│   ├── order.ts                       # 📦 Entidade de pedido
│   └── order-item.ts                  # 🛒 Item do pedido
├── services/
│   └── order-processor.ts             # ⚙️ Serviço de processamento
├── gateways/
│   ├── stripe-gateway-payment.ts       # 🔌 Adapter para Stripe
│   ├── mercado-pago-gateway-payment.ts # 🔌 Adapter para Mercado Pago
│   ├── paypal-gateway-payment.ts       # 🔌 Adapter para PayPal
│   ├── stripe.ts                      # 🏢 Cliente Stripe (simulado)
│   ├── mercado-pago.ts                # 🏢 Cliente Mercado Pago (simulado)
│   └── paypal.ts                      # 🏢 Cliente PayPal (simulado)
├── tests/
│   └── order-processor.test.ts        # 🧪 Testes unitários
└── example.ts                         # 📖 Exemplos de uso
package.json                           # 📦 Configurações do projeto
tsconfig.json                          # ⚙️ Configurações TypeScript
README.md                              # 📜 Documentação
```

## 🔍 Como Funciona

### 1. Abstração (Interface)

```typescript
// src/interfaces/payment-gateway.interface.ts
export interface IPaymentGateway {
  pay(order: Order): { transactionId: string; status: string };
}
```

- Define o contrato para gateways de pagamento, garantindo que `OrderProcessorService` dependa de uma abstração (DIP).

### 2. Modelo de Domínio

```typescript
// src/models/order-item.ts
export class OrderItem {
  constructor(
    public name: string,
    public productId: string,
    public price: number,
    public quantity: number
  ) {
    if (price < 0 || quantity < 0) {
      throw new Error("Preço e quantidade devem ser não negativos");
    }
  }
}

// src/models/order.ts
export class Order {
  constructor(
    public id: string,
    public userId: string,
    public items: OrderItem[],
    public total: number
  ) {
    if (total < 0) {
      throw new Error("Total do pedido deve ser não negativo");
    }
  }
}
```

### 3. Serviço de Aplicação

```typescript
// src/services/order-processor.ts
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";
import { Order } from "../models/order";

export class OrderProcessorService {
  constructor(private gatewayPayment: IPaymentGateway) {}

  public process(order: Order): { transactionId: string; status: string } {
    try {
      return this.gatewayPayment.pay(order);
    } catch (error) {
      throw new Error(`Falha no processamento do pagamento: ${error.message}`);
    }
  }
}
```

- Usa **injeção de dependência** para receber um `IPaymentGateway`, respeitando o **DIP**.
- Inclui tratamento básico de erros.

### 4. Adapters (Gateways de Pagamento)

```typescript
// src/gateways/stripe.ts
export class StripeClient {
  processPayment(
    amount: number,
    currency: string
  ): { id: string; status: string } {
    // Simula integração com Stripe
    if (amount <= 0) throw new Error("Valor inválido");
    return { id: `stripe_${Date.now()}`, status: "success" };
  }
}

// src/gateways/stripe-gateway-payment.ts
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";
import { Order } from "../models/order";
import { StripeClient } from "./stripe";

export class StripeGatewayPayment implements IPaymentGateway {
  private stripe: StripeClient;

  constructor() {
    this.stripe = new StripeClient();
  }

  pay(order: Order): { transactionId: string; status: string } {
    return this.stripe.processPayment(order.total, "USD");
  }
}

// src/gateways/mercado-pago.ts
export class MercadoPagoClient {
  createPayment(
    amount: number,
    currency: string
  ): { transaction_id: string; status: string } {
    // Simula integração com Mercado Pago
    if (amount <= 0) throw new Error("Valor inválido");
    return { transaction_id: `mp_${Date.now()}`, status: "approved" };
  }
}

// src/gateways/mercado-pago-gateway-payment.ts
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";
import { Order } from "../models/order";
import { MercadoPagoClient } from "./mercado-pago";

export class MercadoPagoPaymentGateway implements IPaymentGateway {
  private mercadoPago: MercadoPagoClient;

  constructor() {
    this.mercadoPago = new MercadoPagoClient();
  }

  pay(order: Order): { transactionId: string; status: string } {
    const result = this.mercadoPago.createPayment(order.total, "BRL");
    return { transactionId: result.transaction_id, status: result.status };
  }
}

// src/gateways/paypal.ts
export class PayPalClient {
  executePayment(
    amount: number,
    currency: string
  ): { paymentId: string; state: string } {
    // Simula integração com PayPal
    if (amount <= 0) throw new Error("Valor inválido");
    return { paymentId: `paypal_${Date.now()}`, state: "completed" };
  }
}

// src/gateways/paypal-gateway-payment.ts
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";
import { Order } from "../models/order";
import { PayPalClient } from "./paypal";

export class PayPalGatewayPayment implements IPaymentGateway {
  private paypal: PayPalClient;

  constructor() {
    this.paypal = new PayPalClient();
  }

  pay(order: Order): { transactionId: string; status: string } {
    const result = this.paypal.executePayment(order.total, "USD");
    return { transactionId: result.paymentId, status: result.state };
  }
}
```

### 5. Exemplo de Uso

```typescript
// src/example.ts
import { Order, OrderItem } from "./models";
import { OrderProcessorService } from "./services/order-processor";
import { StripeGatewayPayment } from "./gateways/stripe-gateway-payment";
import { MercadoPagoPaymentGateway } from "./gateways/mercado-pago-gateway-payment";
import { PayPalGatewayPayment } from "./gateways/paypal-gateway-payment";

// Criar pedido
const items = [
  new OrderItem("Camiseta", "prod123", 50.0, 2),
  new OrderItem("Boné", "prod456", 25.0, 1),
];
const order = new Order("order123", "user456", items, 125.0);

// Usar Stripe
const stripeGateway = new StripeGatewayPayment();
const stripeProcessor = new OrderProcessorService(stripeGateway);
console.log(stripeProcessor.process(order)); // Output: { transactionId: 'stripe_...', status: 'success' }

// Usar Mercado Pago
const mercadoPagoGateway = new MercadoPagoPaymentGateway();
const mercadoPagoProcessor = new OrderProcessorService(mercadoPagoGateway);
console.log(mercadoPagoProcessor.process(order)); // Output: { transactionId: 'mp_...', status: 'approved' }

// Usar PayPal
const paypalGateway = new PayPalGatewayPayment();
const paypalProcessor = new OrderProcessorService(paypalGateway);
console.log(paypalProcessor.process(order)); // Output: { transactionId: 'paypal_...', status: 'completed' }
```

## 💡 Benefícios

- **Flexibilidade**: Troque gateways sem alterar o código cliente:
  ```typescript
  const processor = new OrderProcessorService(new StripeGatewayPayment());
  processor.process(order);
  // Troca para PayPal
  processor["gatewayPayment"] = new PayPalGatewayPayment(); // Nota: Use setters em produção
  processor.process(order);
  ```
- **Testabilidade**: Facilite testes com mocks:
  ```typescript
  class MockPaymentGateway implements IPaymentGateway {
    pay(order: Order): { transactionId: string; status: string } {
      return { transactionId: `mock_${order.id}`, status: "mocked" };
    }
  }
  const processor = new OrderProcessorService(new MockPaymentGateway());
  ```
- **Manutenibilidade**: Mudanças em um gateway não afetam outros.
- **Extensibilidade**: Adicione novos gateways criando classes que implementam `IPaymentGateway`.

## 🧪 Testes Unitários

Testes unitários foram adicionados para validar o comportamento do `OrderProcessorService`. Usamos **Jest** para criar mocks e verificar a integração com gateways.

```typescript
// src/tests/order-processor.test.ts
import { OrderProcessorService } from "../services/order-processor";
import { Order, OrderItem } from "../models";
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

describe("OrderProcessorService", () => {
  let order: Order;
  let mockGateway: IPaymentGateway;

  beforeEach(() => {
    const items = [new OrderItem("Teste", "prod1", 100, 1)];
    order = new Order("order1", "user1", items, 100);
    mockGateway = {
      pay: jest
        .fn()
        .mockReturnValue({ transactionId: "mock_123", status: "mocked" }),
    };
  });

  test("deve processar pagamento com sucesso", () => {
    const processor = new OrderProcessorService(mockGateway);
    const result = processor.process(order);
    expect(mockGateway.pay).toHaveBeenCalledWith(order);
    expect(result).toEqual({ transactionId: "mock_123", status: "mocked" });
  });

  test("deve lançar erro se o gateway falhar", () => {
    mockGateway.pay = jest.fn().mockImplementation(() => {
      throw new Error("Falha no pagamento");
    });
    const processor = new OrderProcessorService(mockGateway);
    expect(() => processor.process(order)).toThrow(
      "Falha no processamento do pagamento"
    );
  });
});
```

### Como Executar Testes

```bash
npm install --save-dev jest ts-jest @types/jest
npx jest --init
npm test
```

### Configuração do Jest (`package.json`)

```json
{
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v16 ou superior)
- TypeScript (`npm install -g typescript`)
- Jest para testes (`npm install --save-dev jest ts-jest @types/jest`)

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
- Desenvolvimento com hot-reload:
  ```bash
  npm run dev
  ```
- Executar testes:
  ```bash
  npm test
  ```

### Estrutura do `package.json`

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/example.js",
    "dev": "tsc --watch",
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

## 📚 Conceitos Aplicados

- **DIP**:

  - **Módulo de alto nível**: `OrderProcessorService`.
  - **Módulo de baixo nível**: `StripeGatewayPayment`, `MercadoPagoPaymentGateway`, `PayPalGatewayPayment`.
  - **Abstração**: `IPaymentGateway`.
  - **Resultado**: O serviço depende da interface, não das implementações.

- **Padrão Adapter**:

  - **Target**: `IPaymentGateway`.
  - **Adaptee**: APIs do Stripe, Mercado Pago e PayPal.
  - **Adapter**: Classes `StripeGatewayPayment`, `MercadoPagoPaymentGateway`, `PayPalGatewayPayment`.
  - **Client**: `OrderProcessorService`.

- **Conexão com OCP**: Similar ao exemplo de descontos do projeto anterior, novos gateways podem ser adicionados sem modificar o código cliente, respeitando o **OCP**.

## 🎓 Aprendizados

1. **Abstrações Promovem Flexibilidade**: Interfaces como `IPaymentGateway` permitem trocar implementações sem impacto no código cliente.
2. **Injeção de Dependência**: Facilita testes e manutenção, como visto nos mocks.
3. **Padrão Adapter**: Encapsula a complexidade de APIs externas, mantendo o sistema limpo.
4. **Alinhamento com SOLID**: Combina **DIP**, **OCP**, **ISP**, e **SRP** para um design robusto.

## 🔄 Próximos Passos

- [ ] Adicionar uma factory para criar gateways dinamicamente:
  ```typescript
  class PaymentGatewayFactory {
    static createGateway(type: string): IPaymentGateway {
      switch (type) {
        case "stripe":
          return new StripeGatewayPayment();
        case "mercado-pago":
          return new MercadoPagoPaymentGateway();
        case "paypal":
          return new PayPalGatewayPayment();
        default:
          throw new Error("Gateway não suportado");
      }
    }
  }
  ```
- [ ] Implementar logging para rastrear transações.
- [ ] Adicionar suporte a múltiplos gateways com fallback.
- [ ] Melhorar tratamento de erros (ex.: reintentos para falhas temporárias).
- [ ] Criar uma CLI para testar diferentes gateways.

---

**💡 Dica**: O **DIP** e o **Padrão Adapter** são como um adaptador universal de tomada: seu sistema funciona com qualquer gateway, desde que siga a interface padrão, garantindo escalabilidade e facilidade de manutenção!
