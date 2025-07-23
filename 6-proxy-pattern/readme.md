# 🔒 Padrão de Projeto Proxy

Este projeto demonstra a aplicação do **Padrão de Projeto Proxy** em um sistema de processamento de pagamentos, integrado com um sistema de pedidos semelhante aos projetos anteriores (SRP, OCP, DIP, ISP). Usando **TypeScript**, o código ilustra como o Proxy atua como um intermediário para adicionar funcionalidades como controle de acesso e cache, sem modificar o serviço original.

## 🎯 Objetivo

O objetivo é mostrar como o **Padrão Proxy**:

- Controla o acesso a um objeto real (ex.: verificando permissões).
- Adiciona funcionalidades extras (ex.: cache) sem alterar o comportamento original.
- Alinha-se com os princípios SOLID, como **SRP** (separando responsabilidades) e **DIP** (dependendo de abstrações).

## 📚 Conceito Principal

### Padrão Proxy

- **Definição**: Um Proxy é uma classe que atua como intermediário entre o cliente e um objeto real, controlando o acesso a ele para adicionar funcionalidades como validação, cache, logging ou lazy loading.
- **Analogia**: Pense em um porteiro de um prédio. Ele verifica se você tem permissão para entrar (controle de acesso) e pode lembrar quem já passou (cache), sem precisar modificar o prédio (objeto real).

### Conexão com SOLID

- **Single Responsibility Principle (SRP)**: O Proxy (`PaymentProxy`) tem a responsabilidade única de gerenciar acesso e cache, enquanto o `RealPaymentProcessor` processa pagamentos.
- **Dependency Inversion Principle (DIP)**: O Proxy e o cliente dependem da abstração `IPaymentGateway`, como no projeto de gateways.
- **Open/Closed Principle (OCP)**: Novas funcionalidades (ex.: logging) podem ser adicionadas criando novos Proxies sem modificar o serviço original.
- **Interface Segregation Principle (ISP)**: A interface `IPaymentGateway` é enxuta, contendo apenas o método `processPayment`.

## 📁 Estrutura do Projeto

```
src/
├── interfaces/
│   └── payment-gateway.interface.ts    # 🔌 Interface para gateways
├── models/
│   └── order.ts                       # 📦 Entidade de pedido
├── services/
│   ├── real-payment-processor.ts       # 💳 Serviço real de pagamento
│   └── payment-proxy.ts               # 🔒 Proxy para pagamento
├── tests/
│   └── payment-proxy.test.ts          # 🧪 Testes unitários
└── index.ts                           # 📖 Ponto de entrada
package.json                           # 📦 Configurações do projeto
tsconfig.json                          # ⚙️ Configurações TypeScript
README.md                              # 📜 Documentação
```

## 🔍 Como Funciona

### 1. Abstração (Interface)

```typescript
// src/interfaces/payment-gateway.interface.ts
export interface IPaymentGateway {
  processPayment(
    orderId: string,
    amount: number
  ): { transactionId: string; status: string };
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
    if (amount < 0) throw new Error("Valor do pedido deve ser não negativo");
    if (!id) throw new Error("ID do pedido é obrigatório");
  }

  complete(): void {
    this.status = "completed";
  }
}
```

### 3. Serviço Real

```typescript
// src/services/real-payment-processor.ts
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

export class RealPaymentProcessor implements IPaymentGateway {
  processPayment(
    orderId: string,
    amount: number
  ): { transactionId: string; status: string } {
    if (amount <= 0) throw new Error("Valor inválido para pagamento");
    console.log(
      `Processando pagamento para pedido ${orderId} com valor R$${amount}`
    );
    return { transactionId: `txn_${Date.now()}`, status: "success" };
  }
}
```

### 4. Proxy

```typescript
// src/services/payment-proxy.ts
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

export class PaymentProxy implements IPaymentGateway {
  private cache: Map<string, { transactionId: string; status: string }> =
    new Map();

  constructor(
    private realProcessor: IPaymentGateway,
    private userRole: string
  ) {}

  processPayment(
    orderId: string,
    amount: number
  ): { transactionId: string; status: string } {
    // Controle de acesso
    if (this.userRole !== "admin") {
      throw new Error(
        "Acesso negado: apenas administradores podem processar pagamentos"
      );
    }

    // Verifica cache
    const cacheKey = `${orderId}_${amount}`;
    if (this.cache.has(cacheKey)) {
      console.log(`Retornando resultado do cache para pedido ${orderId}`);
      return this.cache.get(cacheKey)!;
    }

    // Chama o serviço real
    const result = this.realProcessor.processPayment(orderId, amount);
    this.cache.set(cacheKey, result);
    return result;
  }
}
```

### 5. Ponto de Entrada

```typescript
// src/index.ts
import { Order } from "./models/order";
import { RealPaymentProcessor } from "./services/real-payment-processor";
import { PaymentProxy } from "./services/payment-proxy";

function main() {
  const order = new Order("order123", 100);

  // Usuário autorizado (admin)
  const adminProcessor = new PaymentProxy(new RealPaymentProcessor(), "admin");
  console.log(adminProcessor.processPayment(order.id, order.amount));
  console.log(adminProcessor.processPayment(order.id, order.amount)); // Usa cache

  // Usuário não autorizado
  const guestProcessor = new PaymentProxy(new RealPaymentProcessor(), "guest");
  try {
    guestProcessor.processPayment(order.id, order.amount);
  } catch (error) {
    console.log(error.message);
  }

  order.complete();
  console.log(order.status);
}

main();
```

## ❌ Problema: Sem Proxy

Sem o Proxy, o cliente acessa diretamente o `RealPaymentProcessor`, o que apresenta problemas:

- **Falta de controle de acesso**: Qualquer usuário pode chamar o serviço.
- **Processamento redundante**: Chamadas repetidas ao gateway para o mesmo pedido.
- **Acoplamento**: Adicionar funcionalidades (ex.: cache) exige modificar o serviço original.

```typescript
const processor = new RealPaymentProcessor();
processor.processPayment("order123", 100); // Sem validação de permissões ou cache
```

## ✅ Solução: Aplicando o Proxy

O `PaymentProxy`:

- Verifica permissões (apenas admins podem processar).
- Usa cache para evitar chamadas redundantes.
- Mantém o `RealPaymentProcessor` inalterado, respeitando **SRP** e **OCP**.

**Benefícios**:

- **Controle de acesso**: Garante que apenas usuários autorizados usem o serviço.
- **Otimização**: Cache reduz chamadas desnecessárias ao gateway.
- **Extensibilidade**: Novas funcionalidades (ex.: logging) podem ser adicionadas em novos Proxies.

## 💡 Benefícios Demonstrados

- **Segurança**: Controle de acesso baseado em papéis de usuário.
- **Desempenho**: Cache evita processamento repetitivo.
- **Manutenibilidade**: O Proxy isola funcionalidades extras, mantendo o serviço original intacto.
- **Testabilidade**: O Proxy pode ser testado isoladamente com mocks.

## 🧪 Testes Unitários

Testes unitários validam o comportamento do Proxy, incluindo controle de acesso e cache.

```typescript
// src/tests/payment-proxy.test.ts
import { PaymentProxy } from "../services/payment-proxy";
import { RealPaymentProcessor } from "../services/real-payment-processor";
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

describe("PaymentProxy", () => {
  let realProcessor: IPaymentGateway;
  let adminProxy: PaymentProxy;
  let guestProxy: PaymentProxy;

  beforeEach(() => {
    realProcessor = new RealPaymentProcessor();
    jest.spyOn(realProcessor, "processPayment");
    adminProxy = new PaymentProxy(realProcessor, "admin");
    guestProxy = new PaymentProxy(realProcessor, "guest");
  });

  test("deve processar pagamento para admin", () => {
    const result = adminProxy.processPayment("order123", 100);
    expect(realProcessor.processPayment).toHaveBeenCalledWith("order123", 100);
    expect(result).toEqual(expect.objectContaining({ status: "success" }));
  });

  test("deve usar cache para chamadas repetidas", () => {
    adminProxy.processPayment("order123", 100);
    adminProxy.processPayment("order123", 100);
    expect(realProcessor.processPayment).toHaveBeenCalledTimes(1); // Cache usado
  });

  test("deve bloquear acesso para não-admin", () => {
    expect(() => guestProxy.processPayment("order123", 100)).toThrow(
      "Acesso negado"
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
    "start": "node dist/index.js",
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

### Cenário: Adicionar Logging no Proxy

```typescript
// src/services/logging-payment-proxy.ts
import { IPaymentGateway } from "../interfaces/payment-gateway.interface";

export class LoggingPaymentProxy implements IPaymentGateway {
  constructor(
    private realProcessor: IPaymentGateway,
    private userRole: string
  ) {}

  processPayment(
    orderId: string,
    amount: number
  ): { transactionId: string; status: string } {
    if (this.userRole !== "admin") {
      throw new Error(
        "Acesso negado: apenas administradores podem processar pagamentos"
      );
    }
    console.log(
      `[LOG] Iniciando processamento para pedido ${orderId}, valor R$${amount}`
    );
    const result = this.realProcessor.processPayment(orderId, amount);
    console.log(`[LOG] Pagamento concluído: ${JSON.stringify(result)}`);
    return result;
  }
}
```

## 📚 Conceitos Aplicados

- **Proxy**: O `PaymentProxy` adiciona controle de acesso e cache sem modificar o `RealPaymentProcessor`.
- **SRP**: O Proxy lida apenas com acesso e cache, enquanto o serviço real processa pagamentos.
- **DIP**: Ambos dependem da interface `IPaymentGateway`.
- **OCP**: Novas funcionalidades (ex.: logging) podem ser adicionadas com novos Proxies.

## 🎓 Aprendizados

1. **Controle de Acesso**: O Proxy adiciona segurança sem alterar o serviço original.
2. **Otimização**: Cache melhora o desempenho para chamadas repetidas.
3. **Separação de Responsabilidades**: O Proxy mantém funcionalidades extras separadas.
4. **Alinhamento com SOLID**: Combina com **SRP**, **DIP**, **OCP**, e **ISP** para um design robusto.

## 🔄 Próximos Passos

- [ ] Adicionar lazy loading no Proxy para inicializar o serviço real sob demanda.

- [ ] Implementar logging mais robusto (ex.: salvar logs em arquivo).

- [ ] Adicionar suporte a múltiplos Proxies encadeados (ex.: cache + logging).

- [ ] Integrar com o projeto de gateways (DIP) para usar Proxies com Stripe ou Mercado Pago.

- [ ] Criar uma factory para instanciar Proxies:

  ```typescript
  class PaymentProxyFactory {
    static createProxy(role: string, type: string): IPaymentGateway {
      const realProcessor = new RealPaymentProcessor();
      switch (type) {
        case "cache":
          return new PaymentProxy(realProcessor, role);
        case "logging":
          return new LoggingPaymentProxy(realProcessor, role);
        default:
          throw new Error("Tipo de Proxy não suportado");
      }
    }
  }
  ```

---

💡 Dica: O Padrão Proxy é como um porteiro eficiente: ele verifica permissões, lembra quem já passou, e mantém o prédio (serviço real) funcionando sem alterações. Isso garante segurança, desempenho e flexibilidade!
