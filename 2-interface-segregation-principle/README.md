# 🔌 Interface Segregation Principle (ISP)

Este projeto demonstra a aplicação do **Interface Segregation Principle (ISP)**, um dos pilares do SOLID, em um sistema de métodos de pagamento (Cartão de Crédito, Boleto e PIX). Usando **TypeScript**, o código ilustra como interfaces específicas e coesas evitam que classes sejam forçadas a implementar métodos desnecessários, promovendo um design mais flexível, testável e manutenível.

## 🎯 Objetivo

O objetivo é mostrar como o **ISP**:

- Cria interfaces específicas, evitando interfaces monolíticas.
- Garante que classes implementem apenas os métodos que realmente usam.
- Alinha-se com outros princípios SOLID, como **OCP** (extensibilidade) e **DIP** (dependência de abstrações), vistos em projetos anteriores.

## 📚 Conceitos Principais

### Interface Segregation Principle (ISP)

- **Definição**: "Clientes não devem ser forçados a implementar interfaces que não usam." Interfaces devem ser pequenas, coesas e focadas em uma única responsabilidade.
- **Analogia**: Pense em uma caixa de ferramentas. Em vez de uma ferramenta gigante que faz tudo (e é difícil de usar), é melhor ter ferramentas específicas (chave de fenda, martelo) para cada tarefa. O ISP faz o mesmo: cria interfaces específicas para cada necessidade.

### Conexão com SOLID

- **Open/Closed Principle (OCP)**: Similar ao sistema de descontos do projeto anterior, novas funcionalidades (ex.: novos métodos de pagamento) podem ser adicionadas sem modificar o código existente.
- **Dependency Inversion Principle (DIP)**: Interfaces específicas como `IPaymentMethod` são abstrações que reduzem o acoplamento.
- **Single Responsibility Principle (SRP)**: Cada interface tem uma responsabilidade clara, como pagamento ou geração de documentos.

## 📁 Estrutura do Projeto

```
src/
├── interfaces/
│   ├── payment-method.interface.ts      # 🔌 Interface para pagamento
│   ├── generate-document.interface.ts   # 🔌 Interface para documentos
│   └── generate-qr-code.interface.ts    # 🔌 Interface para QR Code
├── methods/
│   ├── credit-card.ts                  # 💳 Implementação Cartão de Crédito
│   ├── boleto.ts                       # 🧾 Implementação Boleto
│   └── pix.ts                          # 📱 Implementação PIX
├── tests/
│   └── payment-methods.test.ts          # 🧪 Testes unitários
└── example.ts                          # 📖 Exemplos de uso
package.json                            # 📦 Configurações do projeto
tsconfig.json                           # ⚙️ Configurações TypeScript
README.md                               # 📜 Documentação
```

## 🔍 Como Funciona

### 1. Interfaces Segregadas

```typescript
// src/interfaces/payment-method.interface.ts
export interface IPaymentMethod {
  pay(
    amount: number,
    description: string
  ): { transactionId: string; status: string };
}

// src/interfaces/generate-document.interface.ts
export interface IGenerateDocument {
  generateDocument(amount: number, description: string): string;
}

// src/interfaces/generate-qr-code.interface.ts
export interface IGenerateQrCode {
  generateQrCode(amount: number, description: string): string;
}
```

- Interfaces pequenas e focadas, cada uma com uma responsabilidade específica.
- Evitam forçar classes a implementar métodos desnecessários.

### 2. Implementações Específicas

```typescript
// src/methods/credit-card.ts
import { IPaymentMethod, IGenerateDocument } from "../interfaces";

export class CreditCard implements IPaymentMethod, IGenerateDocument {
  pay(
    amount: number,
    description: string
  ): { transactionId: string; status: string } {
    if (amount <= 0) throw new Error("Valor deve ser maior que zero");
    return { transactionId: `cc_${Date.now()}`, status: "approved" };
  }

  generateDocument(amount: number, description: string): string {
    return `Comprovante Cartão: ${description} - R$${amount.toFixed(2)}`;
  }
}

// src/methods/boleto.ts
import { IPaymentMethod, IGenerateDocument } from "../interfaces";

export class Boleto implements IPaymentMethod, IGenerateDocument {
  pay(
    amount: number,
    description: string
  ): { transactionId: string; status: string } {
    if (amount <= 0) throw new Error("Valor deve ser maior que zero");
    return { transactionId: `boleto_${Date.now()}`, status: "pending" };
  }

  generateDocument(amount: number, description: string): string {
    return `Boleto: ${description} - R$${amount.toFixed(2)}`;
  }
}

// src/methods/pix.ts
import { IPaymentMethod, IGenerateQrCode } from "../interfaces";

export class Pix implements IPaymentMethod, IGenerateQrCode {
  pay(
    amount: number,
    description: string
  ): { transactionId: string; status: string } {
    if (amount <= 0) throw new Error("Valor deve ser maior que zero");
    return { transactionId: `pix_${Date.now()}`, status: "approved" };
  }

  generateQrCode(amount: number, description: string): string {
    return `QR Code PIX: ${description} - R$${amount.toFixed(2)}`;
  }
}
```

### 3. Exemplo de Uso

```typescript
// src/example.ts
import { CreditCard } from "./methods/credit-card";
import { Boleto } from "./methods/boleto";
import { Pix } from "./methods/pix";

// Cartão de Crédito
const creditCard = new CreditCard();
console.log(creditCard.pay(150.0, "Compra online")); // Output: { transactionId: 'cc_...', status: 'approved' }
console.log(creditCard.generateDocument(150.0, "Compra online")); // Output: Comprovante Cartão: Compra online - R$150.00
// creditCard.generateQrCode(); // ❌ Erro de compilação: Não implementa

// PIX
const pix = new Pix();
console.log(pix.pay(75.5, "Transferência")); // Output: { transactionId: 'pix_...', status: 'approved' }
console.log(pix.generateQrCode(75.5, "Transferência")); // Output: QR Code PIX: Transferência - R$75.50
// pix.generateDocument(); // ❌ Erro de compilação: Não implementa

// Boleto
const boleto = new Boleto();
console.log(boleto.pay(200.0, "Pagamento de conta")); // Output: { transactionId: 'boleto_...', status: 'pending' }
console.log(boleto.generateDocument(200.0, "Pagamento de conta")); // Output: Boleto: Pagamento de conta - R$200.00
// boleto.generateQrCode(); // ❌ Erro de compilação: Não implementa
```

## ❌ Problema: Violação do ISP

Antes da refatoração, uma interface monolítica forçava implementações desnecessárias:

```typescript
interface IPaymentMethod {
  pay(
    amount: number,
    description: string
  ): { transactionId: string; status: string };
  generateDocument(amount: number, description: string): string;
  generateQrCode(amount: number, description: string): string;
}

class CreditCard implements IPaymentMethod {
  pay(
    amount: number,
    description: string
  ): { transactionId: string; status: string } {
    /* ... */
  }
  generateDocument(amount: number, description: string): string {
    /* ... */
  }
  generateQrCode(amount: number, description: string): string {
    throw new Error("Não suportado"); // ❌ Forçado a implementar
  }
}
```

**Problemas**:

- **CreditCard** e **Boleto** não geram QR Code, mas são forçados a implementar `generateQrCode`.
- **Pix** não gera documentos tradicionais, mas é forçado a implementar `generateDocument`.
- **Manutenção difícil**: Mudanças na interface afetam todas as classes, mesmo as que não usam os métodos.

## ✅ Solução: Aplicando o ISP

Interfaces segregadas resolvem o problema:

- `IPaymentMethod`: Para métodos de pagamento (todos implementam).
- `IGenerateDocument`: Para geração de documentos (Cartão e Boleto).
- `IGenerateQrCode`: Para geração de QR Code (apenas PIX).

**Benefícios**:

- Classes implementam apenas o necessário, respeitando o **SRP**.
- Interfaces coesas evitam métodos "fantasma" (não implementados).
- Mudanças em uma interface não afetam classes que não a usam.

## 💡 Benefícios Demonstrados

- **Flexibilidade**: Cada método de pagamento implementa apenas as funcionalidades relevantes.
- **Manutenibilidade**: Interfaces pequenas facilitam mudanças sem impacto em classes irrelevantes.
- **Testabilidade**: Mocks específicos para cada interface são mais simples.
- **Extensibilidade**: Novos métodos de pagamento ou funcionalidades podem ser adicionados com novas interfaces.

## 🧪 Testes Unitários

Testes unitários validam o comportamento das classes, aproveitando a segregação de interfaces.

```typescript
// src/tests/payment-methods.test.ts
import { CreditCard } from "../methods/credit-card";
import { Boleto } from "../methods/boleto";
import { Pix } from "../methods/pix";

describe("Payment Methods", () => {
  test("CreditCard deve processar pagamento e gerar documento", () => {
    const creditCard = new CreditCard();
    expect(creditCard.pay(100, "Teste")).toEqual(
      expect.objectContaining({ status: "approved" })
    );
    expect(creditCard.generateDocument(100, "Teste")).toMatch(
      /Comprovante Cartão: Teste - R\$100\.00/
    );
  });

  test("Pix deve processar pagamento e gerar QR Code", () => {
    const pix = new Pix();
    expect(pix.pay(50, "Teste")).toEqual(
      expect.objectContaining({ status: "approved" })
    );
    expect(pix.generateQrCode(50, "Teste")).toMatch(
      /QR Code PIX: Teste - R\$50\.00/
    );
  });

  test("Boleto deve processar pagamento e gerar documento", () => {
    const boleto = new Boleto();
    expect(boleto.pay(200, "Teste")).toEqual(
      expect.objectContaining({ status: "pending" })
    );
    expect(boleto.generateDocument(200, "Teste")).toMatch(
      /Boleto: Teste - R\$200\.00/
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

## 📖 Exemplo de Extensibilidade

### Cenário 1: Novo Método de Pagamento

```typescript
// src/methods/bank-transfer.ts
import { IPaymentMethod, IGenerateDocument } from "../interfaces";

export class BankTransfer implements IPaymentMethod, IGenerateDocument {
  pay(
    amount: number,
    description: string
  ): { transactionId: string; status: string } {
    if (amount <= 0) throw new Error("Valor deve ser maior que zero");
    return { transactionId: `bank_${Date.now()}`, status: "processed" };
  }

  generateDocument(amount: number, description: string): string {
    return `Comprovante Transferência: ${description} - R$${amount.toFixed(2)}`;
  }
}
```

### Cenário 2: Nova Funcionalidade

```typescript
// src/interfaces/generate-digital-receipt.interface.ts
export interface IGenerateDigitalReceipt {
  generateDigitalReceipt(amount: number, description: string): string;
}

// src/methods/credit-card.ts (atualizado)
export class CreditCard
  implements IPaymentMethod, IGenerateDocument, IGenerateDigitalReceipt
{
  pay(
    amount: number,
    description: string
  ): { transactionId: string; status: string } {
    if (amount <= 0) throw new Error("Valor deve ser maior que zero");
    return { transactionId: `cc_${Date.now()}`, status: "approved" };
  }

  generateDocument(amount: number, description: string): string {
    return `Comprovante Cartão: ${description} - R$${amount.toFixed(2)}`;
  }

  generateDigitalReceipt(amount: number, description: string): string {
    return `Recibo Digital Cartão: ${description} - R$${amount.toFixed(2)}`;
  }
}
```

## 📚 Conceitos Aplicados

- **ISP**: Interfaces pequenas e específicas (`IPaymentMethod`, `IGenerateDocument`, `IGenerateQrCode`) evitam métodos desnecessários.
- **SRP**: Cada classe tem responsabilidades claras (ex.: `Pix` só lida com pagamento e QR Code).
- **OCP**: Novas funcionalidades ou métodos de pagamento podem ser adicionados sem modificar o código existente.
- **DIP**: Classes dependem de interfaces (abstrações), como nos projetos anteriores de descontos e gateways.

## 🎓 Aprendizados

1. **Interfaces Coesas**: Interfaces pequenas e específicas promovem clareza e evitam implementações desnecessárias.
2. **Desacoplamento**: Mudanças em uma interface não afetam classes que não a usam.
3. **Testabilidade**: Interfaces segregadas facilitam a criação de mocks específicos.
4. **Extensibilidade**: Novas funcionalidades podem ser adicionadas com novas interfaces, sem impacto no código existente.

## 🔄 Próximos Passos

- [ ] Adicionar logging para rastrear transações.
- [ ] Implementar uma factory para instanciar métodos de pagamento:
  ```typescript
  class PaymentMethodFactory {
    static createMethod(type: string): IPaymentMethod {
      switch (type) {
        case "credit-card":
          return new CreditCard();
        case "boleto":
          return new Boleto();
        case "pix":
          return new Pix();
        case "bank-transfer":
          return new BankTransfer();
        default:
          throw new Error("Método não suportado");
      }
    }
  }
  ```
- [ ] Adicionar validações mais robustas (ex.: formatos de descrição).
- [ ] Suportar múltiplos métodos de pagamento em uma transação.
- [ ] Criar uma CLI para testar diferentes métodos.

---

**💡 Dica**: O **ISP** é como uma caixa de ferramentas com itens específicos: você usa apenas a ferramenta certa para a tarefa, sem carregar peso extra. Isso torna seu código mais limpo, flexível e fácil de manter!
