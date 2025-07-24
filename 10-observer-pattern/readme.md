# 👀 Padrão de Projeto Observer: Como Criar Código Reativo e Escalável Usando Orientação a Objetos!

Este projeto explora o **Padrão de Projeto Observer** em um sistema de notificações de pedidos, usando **TypeScript**. O Observer permite que objetos (observadores) sejam notificados de mudanças em um objeto principal (sujeito), promovendo reatividade e escalabilidade. Este README detalha o padrão, sua implementação, benefícios e riscos, com exemplos práticos e testes.

## 🎯 Objetivo

O objetivo é:

- Demonstrar como o Observer cria reatividade em mudanças de status de pedidos.
- Mostrar conformidade com o princípio **OCP** (aberto para extensão, fechado para modificação).
- Conectar o padrão aos princípios SOLID (SRP, OCP, DIP, ISP) dos projetos anteriores.
- Fornecer testes unitários para validar o comportamento.
- Oferecer uma abordagem prática para escalabilidade.

## 📚 Conceito Principal

### Padrão Observer

- **Definição**: Define uma relação um-para-muitos entre um sujeito (que mantém o estado) e observadores (que reagem a mudanças).
- **Analogia**: Imagine uma equipe de especialistas monitorando um chefe. Quando o chefe atualiza o status de um projeto, todos os especialistas (observadores) são notificados e agem conforme necessário.
- **Benefícios**:
  - Reatividade: Objetos respondem a mudanças em tempo real.
  - Escalabilidade: Novos observadores podem ser adicionados sem alterar o sujeito.
- **Riscos**: Notificações excessivas podem causar overhead ou ciclos infinitos se mal gerenciadas.

### Conexão com SOLID

- **Single Responsibility Principle (SRP)**: O sujeito gerencia o estado, observadores lidam com reações.
- **Open/Closed Principle (OCP)**: Novos observadores são adicionados por extensão, sem modificar o sujeito.
- **Dependency Inversion Principle (DIP)**: Depende de uma interface de observador como abstração.
- **Interface Segregation Principle (ISP)**: A interface é focada em notificação.

## 📁 Estrutura do Projeto

```
src/
├── interfaces/
│   └── observer.interface.ts          # 🔌 Interface de observador
├── models/
│   └── order.ts                       # 📦 Entidade de pedido
├── services/
│   ├── order-subject.ts               # 📋 Sujeito que notifica
│   ├── email-notifier.ts              # 📧 Observador de e-mail
│   └── sms-notifier.ts                # 📱 Observador de SMS
├── tests/
│   └── order-observer.test.ts         # 🧪 Testes unitários
└── index.ts                           # 📖 Ponto de entrada
package.json                           # 📦 Configurações do projeto
tsconfig.json                          # ⚙️ Configurações TypeScript
README.md                              # 📜 Documentação
```

## 🔍 Como Funciona

### 1. Interface de Observador

```typescript
// src/interfaces/observer.interface.ts
export interface Observer {
  update(status: string): void;
}
```

### 2. Modelo de Domínio

```typescript
// src/models/order.ts
export class Order {
  constructor(
    public id: string,
    public amount: number,
    private _status: string = "pending"
  ) {
    if (amount < 0) throw new Error("Valor inválido");
    if (!id) throw new Error("ID obrigatório");
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }
}
```

### 3. Sujeito (OrderSubject)

```typescript
// src/services/order-subject.ts
import { Observer } from "../interfaces/observer.interface";
import { Order } from "../models/order";

export class OrderSubject {
  private observers: Observer[] = [];
  private order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) this.observers.splice(index, 1);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.order.status);
    }
  }

  setStatus(status: string): void {
    this.order.status = status;
    this.notify();
  }
}
```

### 4. Observadores

```typescript
// src/services/email-notifier.ts
import { Observer } from "../interfaces/observer.interface";

export class EmailNotifier implements Observer {
  update(status: string): void {
    console.log(`Enviando e-mail: Status do pedido atualizado para ${status}`);
  }
}
```

```typescript
// src/services/sms-notifier.ts
import { Observer } from "../interfaces/observer.interface";

export class SmsNotifier implements Observer {
  update(status: string): void {
    console.log(`Enviando SMS: Status do pedido atualizado para ${status}`);
  }
}
```

### 5. Ponto de Entrada

```typescript
// src/index.ts
import { Order } from "./models/order";
import { OrderSubject } from "./services/order-subject";
import { EmailNotifier } from "./services/email-notifier";
import { SmsNotifier } from "./services/sms-notifier";

function main() {
  const order = new Order("order123", 100);
  const orderSubject = new OrderSubject(order);

  const emailNotifier = new EmailNotifier();
  const smsNotifier = new SmsNotifier();

  orderSubject.addObserver(emailNotifier);
  orderSubject.addObserver(smsNotifier);

  console.log("Status inicial:", order.status);
  orderSubject.setStatus("completed");
  orderSubject.removeObserver(smsNotifier);
  orderSubject.setStatus("shipped");
}

main();
```

## ✅ Benefícios Demonstrados

- **Reatividade**: Observadores são notificados automaticamente sobre mudanças.
- **Escalabilidade**: Novos tipos de notificação (ex.: push) podem ser adicionados sem alterar o sujeito.
- **OCP**: Extensível por novos observadores.

## 🧪 Testes Unitários

```typescript
// src/tests/order-observer.test.ts
import { Order } from "../models/order";
import { OrderSubject } from "../services/order-subject";
import { EmailNotifier } from "../services/email-notifier";
import { SmsNotifier } from "../services/sms-notifier";

describe("OrderSubject", () => {
  let order: Order;
  let orderSubject: OrderSubject;
  let emailNotifier: EmailNotifier;
  let smsNotifier: SmsNotifier;

  beforeEach(() => {
    order = new Order("order123", 100);
    orderSubject = new OrderSubject(order);
    emailNotifier = new EmailNotifier();
    smsNotifier = new SmsNotifier();
    jest.spyOn(console, "log").mockImplementation(); // Mock para logs
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("deve notificar observadores ao mudar status", () => {
    orderSubject.addObserver(emailNotifier);
    orderSubject.addObserver(smsNotifier);
    orderSubject.setStatus("completed");
    expect(console.log).toHaveBeenCalledWith(
      "Enviando e-mail: Status do pedido atualizado para completed"
    );
    expect(console.log).toHaveBeenCalledWith(
      "Enviando SMS: Status do pedido atualizado para completed"
    );
  });

  test("deve remover observador corretamente", () => {
    orderSubject.addObserver(emailNotifier);
    orderSubject.addObserver(smsNotifier);
    orderSubject.removeObserver(smsNotifier);
    orderSubject.setStatus("shipped");
    expect(console.log).toHaveBeenCalledWith(
      "Enviando e-mail: Status do pedido atualizado para shipped"
    );
    expect(console.log).not.toHaveBeenCalledWith(
      "Enviando SMS: Status do pedido atualizado para shipped"
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

### Adicionar Novo Observador (PushNotifier)

```typescript
// src/services/push-notifier.ts
import { Observer } from "../interfaces/observer.interface";

export class PushNotifier implements Observer {
  update(status: string): void {
    console.log(
      `Enviando notificação push: Status do pedido atualizado para ${status}`
    );
  }
}
```

### Uso

```typescript
const pushNotifier = new PushNotifier();
orderSubject.addObserver(pushNotifier);
orderSubject.setStatus("delivered");
```

## 📚 Conceitos Aplicados

- **Observer**: Permite reatividade e escalabilidade via notificação.
- **SRP**: Sujeito gerencia estado, observadores reagem.
- **OCP**: Novos observadores são extensíveis.
- **DIP**: Usa `Observer` como abstração.
- **ISP**: Interface focada em `update`.

## 🎓 Aprendizados

1. **Reatividade**: Mudanças disparam ações automáticas.
2. **Escalabilidade**: Facilita adicionar novos observadores.
3. **Testabilidade**: Observadores podem ser testados isoladamente.

## 🔄 Próximos Passos

- [ ] Adicionar controle de prioridade de notificações.
- [ ] Implementar unsubscribe automático após entrega.
- [ ] Integrar com o sistema de pagamentos (DIP).

---

**💡 Dica**: O Observer é como uma equipe monitorando um líder. Quando o líder atualiza o status, todos reagem, tornando o sistema reativo e escalável sem acoplamento rígido!
