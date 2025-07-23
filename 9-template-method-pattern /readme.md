# 🛠️ Template Method Design Pattern: como eliminar código duplicado usando orientação a objetos!

Este projeto explora o **Template Method Design Pattern** em um sistema de processamento de pedidos, usando **TypeScript**. O padrão define um esqueleto de algoritmo em uma classe base, permitindo que subclasses implementem passos específicos, eliminando duplicação de código. Este README detalha o padrão, sua implementação, benefícios e riscos, com exemplos práticos e testes.

## 🎯 Objetivo

O objetivo é:

- Demonstrar como o Template Method reduz duplicação em fluxos de pagamento (ex.: crédito, débito).
- Mostrar conformidade com o princípio **OCP** (aberto para extensão, fechado para modificação).
- Conectar o padrão aos princípios SOLID (SRP, OCP, DIP, ISP) dos projetos anteriores.
- Fornecer testes unitários para validar o comportamento.
- Oferecer uma abordagem prática para extensibilidade.

## 📚 Conceito Principal

### Template Method

- **Definição**: Define o esqueleto de um algoritmo em uma classe base, deixando que subclasses implementem passos específicos sem alterar a estrutura geral.
- **Analogia**: Imagine uma equipe de especialistas seguindo um plano mestre (template). Cada especialista (subclasse) executa sua parte (métodos abstratos) dentro do mesmo fluxo, evitando repetir o plano.
- **Benefícios**:
  - Elimina duplicação de código em algoritmos semelhantes.
  - Facilita manutenção centralizando o fluxo.
- **Riscos**: Subclasses podem violar o contrato se não implementarem corretamente os métodos.

### Conexão com SOLID

- **Single Responsibility Principle (SRP)**: A classe base define o fluxo, enquanto subclasses lidam com detalhes específicos.
- **Open/Closed Principle (OCP)**: Novas estratégias são adicionadas por herança, sem alterar a base.
- **Dependency Inversion Principle (DIP)**: A base depende de abstrações (métodos a serem sobrescritos).
- **Interface Segregation Principle (ISP)**: Métodos abstratos são específicos ao contexto.

## 📁 Estrutura do Projeto

```
src/
├── interfaces/
│   └── payment-process.interface.ts    # 🔌 Interface opcional
├── models/
│   └── order.ts                       # 📦 Entidade de pedido
├── services/
│   ├── payment-template.ts            # 📋 Classe base com template
│   ├── credit-payment.ts              # 💳 Pagamento com cartão de crédito
│   └── debit-payment.ts               # 💵 Pagamento com débito
├── tests/
│   └── payment-template.test.ts       # 🧪 Testes unitários
└── index.ts                           # 📖 Ponto de entrada
package.json                           # 📦 Configurações do projeto
tsconfig.json                          # ⚙️ Configurações TypeScript
README.md                              # 📜 Documentação
```

## 🔍 Como Funciona

### 1. Modelo de Domínio

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

### 2. Classe Base com Template Method

```typescript
// src/services/payment-template.ts
import { Order } from "../models/order";

export abstract class PaymentTemplate {
  processPayment(order: Order): { transactionId: string; status: string } {
    // Fluxo comum
    this.validateOrder(order);
    const paymentDetails = this.preparePayment(order.amount);
    const transaction = this.executePayment(paymentDetails);
    this.updateOrderStatus(order);
    return transaction;
  }

  protected validateOrder(order: Order): void {
    if (order.amount <= 0) throw new Error("Valor inválido para pagamento");
  }

  protected abstract preparePayment(amount: number): {
    amount: number;
    method: string;
  };
  protected abstract executePayment(details: {
    amount: number;
    method: string;
  }): { transactionId: string; status: string };
  protected updateOrderStatus(order: Order): void {
    order.complete();
  }
}
```

### 3. Subclasses

```typescript
// src/services/credit-payment.ts
import { PaymentTemplate } from "./payment-template";
import { Order } from "../models/order";

export class CreditPayment extends PaymentTemplate {
  protected preparePayment(amount: number): { amount: number; method: string } {
    console.log(
      `Preparando pagamento com cartão de crédito para R$${amount.toFixed(2)}`
    );
    return { amount, method: "credit" };
  }

  protected executePayment(details: { amount: number; method: string }): {
    transactionId: string;
    status: string;
  } {
    console.log(
      `Executando pagamento com ${details.method} de R$${details.amount.toFixed(
        2
      )}`
    );
    return { transactionId: `txn_${Date.now()}`, status: "success" };
  }
}
```

```typescript
// src/services/debit-payment.ts
import { PaymentTemplate } from "./payment-template";
import { Order } from "../models/order";

export class DebitPayment extends PaymentTemplate {
  protected preparePayment(amount: number): { amount: number; method: string } {
    console.log(`Preparando pagamento com débito para R$${amount.toFixed(2)}`);
    return { amount, method: "debit" };
  }

  protected executePayment(details: { amount: number; method: string }): {
    transactionId: string;
    status: string;
  } {
    console.log(
      `Executando pagamento com ${details.method} de R$${details.amount.toFixed(
        2
      )}`
    );
    return { transactionId: `txn_${Date.now()}`, status: "success" };
  }
}
```

### 4. Ponto de Entrada

```typescript
// src/index.ts
import { Order } from "./models/order";
import { CreditPayment } from "./services/credit-payment";
import { DebitPayment } from "./services/debit-payment";

function main() {
  const order = new Order("order123", 100);

  const creditPayment = new CreditPayment();
  console.log("Pagamento com Crédito:", creditPayment.processPayment(order));

  const debitPayment = new DebitPayment();
  console.log("Pagamento com Débito:", debitPayment.processPayment(order));
}

main();
```

## ✅ Benefícios Demonstrados

- **Eliminação de Duplicação**: O fluxo comum está na `PaymentTemplate`, enquanto detalhes variam por subclasse.
- **OCP**: Novos métodos de pagamento (ex.: Pix) são adicionados por herança.
- **Manutenibilidade**: Alterações no fluxo afetam apenas a base.

## 🧪 Testes Unitários

```typescript
// src/tests/payment-template.test.ts
import { Order } from "../models/order";
import { CreditPayment } from "../services/credit-payment";
import { DebitPayment } from "./services/debit-payment";

describe("PaymentTemplate", () => {
  let order: Order;
  let creditPayment: CreditPayment;
  let debitPayment: DebitPayment;

  beforeEach(() => {
    order = new Order("order123", 100);
    creditPayment = new CreditPayment();
    debitPayment = new DebitPayment();
  });

  test("deve processar pagamento com crédito", () => {
    const result = creditPayment.processPayment(order);
    expect(result.status).toBe("success");
    expect(order.status).toBe("completed");
  });

  test("deve processar pagamento com débito", () => {
    const result = debitPayment.processPayment(order);
    expect(result.status).toBe("success");
    expect(order.status).toBe("completed");
  });

  test("deve falhar com valor inválido", () => {
    const invalidOrder = new Order("invalid", -1);
    expect(() => creditPayment.processPayment(invalidOrder)).toThrow(
      "Valor inválido para pagamento"
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

### Adicionar Novo Método de Pagamento (Pix)

```typescript
// src/services/pix-payment.ts
import { PaymentTemplate } from "./payment-template";
import { Order } from "../models/order";

export class PixPayment extends PaymentTemplate {
  protected preparePayment(amount: number): { amount: number; method: string } {
    console.log(`Gerando QR Code para pagamento Pix de R$${amount.toFixed(2)}`);
    return { amount, method: "pix" };
  }

  protected executePayment(details: { amount: number; method: string }): {
    transactionId: string;
    status: string;
  } {
    console.log(`Confirmando pagamento Pix de R$${details.amount.toFixed(2)}`);
    return { transactionId: `txn_${Date.now()}`, status: "success" };
  }
}
```

### Uso

```typescript
const pixPayment = new PixPayment();
console.log("Pagamento com Pix:", pixPayment.processPayment(order));
```

## 📚 Conceitos Aplicados

- **Template Method**: Define o fluxo em `PaymentTemplate`, com passos sobrescritos.
- **SRP**: A base gerencia o fluxo, subclasses os detalhes.
- **OCP**: Novos pagamentos são extensíveis por herança.
- **DIP**: Depende de abstrações via métodos abstratos.
- **ISP**: Métodos são específicos ao fluxo de pagamento.

## 🎓 Aprendizados

1. **Redução de Duplicação**: Centraliza o algoritmo comum.
2. **Flexibilidade**: Facilita adicionar novos métodos via subclasses.
3. **Testabilidade**: Testa o fluxo geral e detalhes separadamente.

## 🔄 Próximos Passos

- [ ] Adicionar validação de timeout no fluxo.
- [ ] Implementar rollback em caso de falha.
- [ ] Integrar com o sistema de gateways (DIP).

---

**💡 Dica**: O Template Method é como um plano mestre para uma equipe de especialistas. O fluxo geral é fixo, mas cada especialista adapta sua parte, eliminando repetições e mantendo o controle!
