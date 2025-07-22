# 📋 Princípio da Responsabilidade Única (SRP)

Este projeto demonstra a aplicação do **Princípio da Responsabilidade Única (Single Responsibility Principle - SRP)**, um dos pilares do SOLID, em um sistema de processamento de pedidos. O SRP afirma que **uma classe deve ter apenas uma razão para mudar**, ou seja, cada classe deve ter uma única responsabilidade bem definida. Usando **TypeScript**, o código ilustra como separar responsabilidades promove um design modular, testável e manutenível.

## 🎯 Objetivo

O objetivo é mostrar como o **SRP**:
- Divide responsabilidades em classes específicas (ex.: gerenciamento de pedidos, verificação de estoque, processamento de pagamento).
- Reduz o acoplamento e facilita a manutenção.
- Alinha-se com outros princípios SOLID, como **OCP**, **DIP**, e **ISP**, vistos em projetos anteriores.

## 📚 Conceito Principal

### Single Responsibility Principle (SRP)
- **Definição**: Uma classe deve ter apenas uma responsabilidade e, portanto, apenas um motivo para mudar. Isso significa que cada classe deve focar em uma única tarefa no sistema.
- **Analogia**: Pense em uma equipe de trabalho onde cada funcionário tem uma especialidade: um é contador, outro é estoquista, e outro é caixa. Cada um faz sua tarefa sem interferir nas demais. O SRP faz o mesmo: cada classe tem um papel claro, como calcular preços ou processar pagamentos.

### Conexão com SOLID
- **Open/Closed Principle (OCP)**: Como no exemplo de descontos anterior, novas funcionalidades (ex.: novo método de pagamento) podem ser adicionadas sem modificar classes existentes.
- **Dependency Inversion Principle (DIP)**: Classes dependem de abstrações (interfaces) para reduzir acoplamento, como no sistema de gateways de pagamento.
- **Interface Segregation Principle (ISP)**: Interfaces específicas (ex.: para cálculo ou pagamento) evitam métodos desnecessários, complementando o SRP.

## 📁 Estrutura do Projeto

```
src/
├── models/
│   └── order.ts                       # 📦 Entidade de pedido
├── services/
│   ├── order-processor-service.ts     # ⚙️ Serviço de processamento
│   ├── inventory-checker.ts           # 📦 Verificação de estoque
│   ├── payment-processor.ts           # 💳 Processamento de pagamento
│   └── order-calculator.ts            # 🧮 Cálculo do pedido
├── tests/
│   └── order-processor.test.ts        # 🧪 Testes unitários
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
        public uuid: string,
        public amount: number,
        public status: string = 'pending'
    ) {
        if (amount < 0) throw new Error("Valor do pedido deve ser não negativo");
        if (!uuid) throw new Error("UUID do pedido é obrigatório");
    }

    closeOrder(): void {
        this.status = 'closed';
    }
}
```

### 2. Serviços Especializados
```typescript
// src/services/inventory-checker.ts
export class InventoryChecker {
    checkStock(order: Order): boolean {
        // Simula verificação de estoque
        if (order.amount <= 0) throw new Error("Valor inválido para verificação de estoque");
        return true; // Estoque disponível
    }
}

// src/services/payment-processor.ts
export class PaymentProcessor {
    processPayment(order: Order): { transactionId: string; status: string } {
        if (order.amount <= 0) throw new Error("Valor inválido para pagamento");
        return { transactionId: `txn_${Date.now()}`, status: 'success' };
    }
}

// src/services/order-calculator.ts
export class OrderCalculator {
    calculateTotal(order: Order): number {
        if (order.amount <= 0) throw new Error("Valor inválido para cálculo");
        return order.amount; // Simula cálculo (pode incluir impostos, descontos, etc.)
    }
}

// src/services/order-processor-service.ts
import { Order } from '../models/order';
import { InventoryChecker } from './inventory-checker';
import { PaymentProcessor } from './payment-processor';
import { OrderCalculator } from './order-calculator';

export class OrderProcessorService {
    constructor(
        private inventoryChecker: InventoryChecker,
        private paymentProcessor: PaymentProcessor,
        private orderCalculator: OrderCalculator
    ) {}

    processOrder(order: Order): { transactionId: string; status: string } {
        try {
            // Verifica estoque
            if (!this.inventoryChecker.checkStock(order)) {
                throw new Error("Estoque insuficiente");
            }

            // Calcula total
            const total = this.orderCalculator.calculateTotal(order);
            order.amount = total;

            // Processa pagamento
            const result = this.paymentProcessor.processPayment(order);

            // Fecha pedido
            order.closeOrder();

            return result;
        } catch (error) {
            throw new Error(`Erro ao processar pedido: ${error.message}`);
        }
    }
}
```

### 3. Ponto de Entrada
```typescript
// src/index.ts
import { Order } from './models/order';
import { OrderProcessorService, InventoryChecker, PaymentProcessor, OrderCalculator } from './services';

const order = new Order('order123', 100);
const orderProcessorService = new OrderProcessorService(
    new InventoryChecker(),
    new PaymentProcessor(),
    new OrderCalculator()
);

const result = orderProcessorService.processOrder(order);
console.log(result); // Output: { transactionId: 'txn_...', status: 'success' }
console.log(order.status); // Output: closed
```

## ❌ Problema: Violação do SRP

Antes da refatoração, uma única classe poderia ter várias responsabilidades:

```typescript
class OrderProcessor {
    constructor(public order: Order) {}

    processOrder(): void {
        // Verifica estoque
        if (this.order.amount <= 0) throw new Error("Estoque insuficiente");

        // Calcula total
        this.order.amount = this.order.amount; // Simulação

        // Processa pagamento
        const transactionId = `txn_${Date.now()}`;

        // Fecha pedido
        this.order.status = 'closed';
    }
}
```

**Problemas**:
- **Múltiplas responsabilidades**: Gerencia estoque, cálculo, pagamento e status.
- **Difícil manutenção**: Mudanças em uma funcionalidade (ex.: cálculo de impostos) afetam toda a classe.
- **Baixa testabilidade**: Difícil testar uma funcionalidade isoladamente.

## ✅ Solução: Aplicando o SRP

- **Order**: Gerencia apenas os dados e o estado do pedido.
- **InventoryChecker**: Verifica o estoque.
- **PaymentProcessor**: Processa pagamentos.
- **OrderCalculator**: Calcula o total.
- **OrderProcessorService**: Coordena o fluxo, delegando tarefas.

**Benefícios**:
- Cada classe tem uma única razão para mudar.
- Mudanças em uma funcionalidade não afetam outras.
- Classes são reutilizáveis e fáceis de testar.

## 💡 Benefícios Demonstrados

- **Manutenibilidade**: Alterar a lógica de pagamento afeta apenas `PaymentProcessor`.
- **Testabilidade**: Cada classe pode ser testada isoladamente com mocks.
- **Reutilização**: Classes como `OrderCalculator` podem ser usadas em outros contextos.
- **Extensibilidade**: Novas funcionalidades (ex.: notificação) podem ser adicionadas com novas classes.

## 🧪 Testes Unitários

Testes unitários validam o comportamento isolado de cada classe, aproveitando a separação de responsabilidades.

```typescript
// src/tests/order-processor.test.ts
import { Order } from '../models/order';
import { OrderProcessorService, InventoryChecker, PaymentProcessor, OrderCalculator } from '../services';

describe('OrderProcessorService', () => {
    let order: Order;
    let inventoryChecker: InventoryChecker;
    let paymentProcessor: PaymentProcessor;
    let orderCalculator: OrderCalculator;
    let processor: OrderProcessorService;

    beforeEach(() => {
        order = new Order('order123', 100);
        inventoryChecker = { checkStock: jest.fn().mockReturnValue(true) };
        paymentProcessor = { processPayment: jest.fn().mockReturnValue({ transactionId: 'txn_123', status: 'success' }) };
        orderCalculator = { calculateTotal: jest.fn().mockReturnValue(100) };
        processor = new OrderProcessorService(inventoryChecker, paymentProcessor, orderCalculator);
    });

    test('deve processar pedido com sucesso', () => {
        const result = processor.processOrder(order);
        expect(inventoryChecker.checkStock).toHaveBeenCalledWith(order);
        expect(orderCalculator.calculateTotal).toHaveBeenCalledWith(order);
        expect(paymentProcessor.processPayment).toHaveBeenCalledWith(order);
        expect(order.status).toBe('closed');
        expect(result).toEqual({ transactionId: 'txn_123', status: 'success' });
    });

    test('deve lançar erro se estoque for insuficiente', () => {
        inventoryChecker.checkStock = jest.fn().mockReturnValue(false);
        expect(() => processor.processOrder(order)).toThrow("Estoque insuficiente");
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

### Cenário 1: Adicionar Notificação
```typescript
// src/services/notification-service.ts
export class NotificationService {
    notify(order: Order, message: string): void {
        console.log(`Notificação para pedido ${order.uuid}: ${message}`);
    }
}

// src/services/order-processor-service.ts (atualizado)
export class OrderProcessorService {
    constructor(
        private inventoryChecker: InventoryChecker,
        private paymentProcessor: PaymentProcessor,
        private orderCalculator: OrderCalculator,
        private notificationService: NotificationService
    ) {}

    processOrder(order: Order): { transactionId: string; status: string } {
        if (!this.inventoryChecker.checkStock(order)) {
            throw new Error("Estoque insuficiente");
        }
        order.amount = this.orderCalculator.calculateTotal(order);
        const result = this.paymentProcessor.processPayment(order);
        order.closeOrder();
        this.notificationService.notify(order, "Pedido processado com sucesso");
        return result;
    }
}
```

## 📚 Conceitos Aplicados

- **SRP**: Cada classe (`Order`, `InventoryChecker`, `PaymentProcessor`, `OrderCalculator`) tem uma única responsabilidade.
- **OCP**: Novas funcionalidades (ex.: notificação) podem ser adicionadas sem modificar classes existentes.
- **DIP**: `OrderProcessorService` depende de abstrações (futuras interfaces), como nos projetos de gateways.
- **ISP**: Interfaces específicas poderiam ser usadas para cada serviço, como no projeto de métodos de pagamento.

## 🎓 Aprendizados

1. **Responsabilidades Claras**: Cada classe tem uma única razão para mudar, facilitando manutenção.
2. **Testabilidade**: Classes isoladas são fáceis de testar com mocks.
3. **Reutilização**: Serviços como `OrderCalculator` podem ser usados em outros contextos.
4. **Alinhamento com SOLID**: O SRP complementa **OCP**, **DIP**, e **ISP**, criando um design robusto.

## 🔄 Próximos Passos

- [ ] Adicionar interfaces para serviços (`IInventoryChecker`, `IPaymentProcessor`, etc.) para alinhar com **DIP**.
- [ ] Implementar uma factory para instanciar serviços:
  ```typescript
  class ServiceFactory {
      static createProcessor(): OrderProcessorService {
          return new OrderProcessorService(
              new InventoryChecker(),
              new PaymentProcessor(),
              new OrderCalculator(),
              new NotificationService()
          );
      }
  }
  ```
- [ ] Adicionar logging para rastrear o processamento.
- [ ] Suportar múltiplos métodos de pagamento, integrando com o projeto de gateways.
- [ ] Melhorar tratamento de erros (ex.: reintentos para pagamentos).

---

**💡 Dica**: O **SRP** é como uma equipe de especialistas: cada funcionário faz uma tarefa específica, tornando o trabalho mais eficiente e fácil de gerenciar. Isso garante um código limpo e preparado para crescer!