# 🔐 Padrão de Projeto Singleton: Multithreading e Testes Unitários Expõem os Riscos deste Padrão de Projeto

Este projeto explora o **Padrão de Projeto Singleton** em um contexto de sistema de pedidos, usando **TypeScript**. O Singleton garante que uma classe tenha apenas uma instância, fornecendo um ponto de acesso global. No entanto, multithreading e testes unitários revelam limitações significativas, como problemas de concorrência e dificuldades de isolamento. Este README detalha o padrão, seus riscos e uma alternativa mais robusta.

## 🎯 Objetivo

O objetivo é:

- Demonstrar como o Singleton funciona em um cenário de gerenciamento de configurações.
- Destacar os riscos associados ao uso em ambientes multithreaded (ex.: corrupção de dados).
- Mostrar os desafios de testes unitários devido à dependência global.
- Propor uma alternativa usando injeção de dependência para mitigar esses problemas.
- Conectar o tema aos princípios SOLID (SRP, OCP, DIP, ISP) dos projetos anteriores.

## 📚 Conceito Principal

### Padrão Singleton

- **Definição**: Garante que uma classe tenha apenas uma instância e fornece um ponto de acesso global a essa instância.
- **Implementação Típica**: Usa um campo estático e um método de acesso controlado (ex.: `getInstance`).
- **Analogia**: Pense em um porteiro único em um prédio de escritórios. Ele controla quem entra, mas se várias pessoas tentarem acessá-lo ao mesmo tempo, pode haver confusão ou atrasos.

### Riscos do Singleton

- **Multithreading**: Em ambientes concorrentes, múltiplas threads podem criar instâncias duplicadas se a sincronização falhar, corrompendo o estado.
- **Testes Unitários**: A dependência global dificulta o isolamento, tornando os testes dependentes de uma única instância compartilhada.
- **Violação de SOLID**:
  - **SRP**: O Singleton mistura a lógica de instanciamento com a lógica de negócio.
  - **DIP**: Depende de uma implementação concreta, não de abstrações.
  - **OCP**: Difícil de estender ou substituir sem alterar o código existente.

## 📁 Estrutura do Projeto

```
src/
├── models/
│   └── order.ts                       # 📦 Entidade de pedido
├── services/
│   ├── config-manager.ts              # ⚙️ Gerenciador de configuração Singleton
│   └── config-manager-injected.ts     # 💉 Alternativa com injeção de dependência
├── tests/
│   └── config-manager.test.ts         # 🧪 Testes unitários
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

### 2. Singleton (ConfigManager)

```typescript
// src/services/config-manager.ts
export class ConfigManager {
  private static instance: ConfigManager;
  private config: { apiKey: string; timeout: number } = {
    apiKey: "",
    timeout: 0,
  };

  private constructor() {
    // Simula inicialização
    this.config = { apiKey: "default-key", timeout: 3000 };
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): { apiKey: string; timeout: number } {
    return { ...this.config };
  }

  public setConfig(apiKey: string, timeout: number): void {
    this.config.apiKey = apiKey;
    this.config.timeout = timeout;
  }
}
```

### 3. Alternativa com Injeção de Dependência

```typescript
// src/services/config-manager-injected.ts
export interface ConfigService {
  getConfig(): { apiKey: string; timeout: number };
  setConfig(apiKey: string, timeout: number): void;
}

export class ConfigManagerInjected implements ConfigService {
  private config: { apiKey: string; timeout: number };

  constructor(config?: { apiKey: string; timeout: number }) {
    this.config = config || { apiKey: "default-key", timeout: 3000 };
  }

  getConfig(): { apiKey: string; timeout: number } {
    return { ...this.config };
  }

  setConfig(apiKey: string, timeout: number): void {
    this.config.apiKey = apiKey;
    this.config.timeout = timeout;
  }
}
```

### 4. Ponto de Entrada

```typescript
// src/index.ts
import { ConfigManager } from "./services/config-manager";
import {
  ConfigManagerInjected,
  ConfigService,
} from "./services/config-manager-injected";
import { Order } from "./models/order";

function useSingletonConfig() {
  const config = ConfigManager.getInstance();
  console.log("Singleton Config:", config.getConfig());
  config.setConfig("new-key", 5000);
  console.log("Updated Singleton Config:", config.getConfig());
}

function useInjectedConfig() {
  const config = new ConfigManagerInjected({
    apiKey: "injected-key",
    timeout: 1000,
  });
  console.log("Injected Config:", config.getConfig());
  config.setConfig("updated-key", 2000);
  console.log("Updated Injected Config:", config.getConfig());
}

useSingletonConfig();
useInjectedConfig();
```

## ❌ Riscos do Singleton

### 1. Multithreading

Em um ambiente multithreaded, sem sincronização adequada, múltiplas instâncias podem ser criadas:

```typescript
// Exemplo de problema (não compilado, apenas ilustrativo)
class UnsafeSingleton {
    private static instance: UnsafeSingleton;
    private constructor() {}

    public static getInstance(): UnsafeSingleton {
        if (!UnsafeSingleton.instance) {
            // Risco: duas threads podem passar por aqui simultaneamente
            UnsafeSingleton.instance = new UnsafeSingleton();
        }
        return UnsafeSingleton.instance;
    }
}
// Solução com sincronização (thread-safe, mas complexa)
public static getInstance(): UnsafeSingleton {
    if (!UnsafeSingleton.instance) {
        synchronized(UnsafeSingleton.class) {
            if (!UnsafeSingleton.instance) {
                UnsafeSingleton.instance = new UnsafeSingleton();
            }
        }
    }
    return UnsafeSingleton.instance;
}
```

- **Risco**: Sem sincronização, o estado pode ser corrompido.

### 2. Testes Unitários

O Singleton dificulta o isolamento:

```typescript
test("deve alterar configuração", () => {
  const config = ConfigManager.getInstance();
  config.setConfig("test-key", 1000);
  expect(config.getConfig()).toEqual({ apiKey: "test-key", timeout: 1000 });
  // Problema: a instância global é compartilhada, afetando outros testes
});
```

- **Solução**: Usar mocks é complexo devido à dependência global.

## ✅ Alternativa: Injeção de Dependência

A classe `ConfigManagerInjected` permite:

- Instanciação múltipla para testes.
- Injeção de mocks ou configurações específicas.
- Conformidade com **DIP** (depende da interface `ConfigService`).

## 💡 Benefícios Demonstrados

- **Isolamento**: Testes podem usar instâncias separadas.
- **Flexibilidade**: Configurações podem ser injetadas dinamicamente.
- **Manutenibilidade**: Evita problemas de concorrência e facilita extensões.

## 🧪 Testes Unitários

```typescript
// src/tests/config-manager.test.ts
import { ConfigManager } from "../services/config-manager";
import {
  ConfigManagerInjected,
  ConfigService,
} from "../services/config-manager-injected";

describe("ConfigManager", () => {
  beforeEach(() => {
    // Limpa a instância global (difícil de resetar)
    // @ts-ignore
    ConfigManager["instance"] = null;
  });

  test("deve retornar configuração padrão com Singleton", () => {
    const config = ConfigManager.getInstance();
    expect(config.getConfig()).toEqual({
      apiKey: "default-key",
      timeout: 3000,
    });
  });

  test("deve compartilhar instância Singleton", () => {
    const config1 = ConfigManager.getInstance();
    const config2 = ConfigManager.getInstance();
    config1.setConfig("test-key", 1000);
    expect(config2.getConfig()).toEqual({ apiKey: "test-key", timeout: 1000 });
  });
});

describe("ConfigManagerInjected", () => {
  test("deve inicializar com configuração injetada", () => {
    const config = new ConfigManagerInjected({
      apiKey: "test-key",
      timeout: 5000,
    });
    expect(config.getConfig()).toEqual({ apiKey: "test-key", timeout: 5000 });
  });

  test("deve permitir instâncias independentes", () => {
    const config1 = new ConfigManagerInjected({
      apiKey: "key1",
      timeout: 1000,
    });
    const config2 = new ConfigManagerInjected({
      apiKey: "key2",
      timeout: 2000,
    });
    config1.setConfig("updated-key1", 3000);
    expect(config2.getConfig()).toEqual({ apiKey: "key2", timeout: 2000 });
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

### Adicionar Sincronização Thread-Safe

```typescript
export class ThreadSafeConfigManager {
  private static instance: ThreadSafeConfigManager;
  private config: { apiKey: string; timeout: number } = {
    apiKey: "",
    timeout: 0,
  };

  private constructor() {
    this.config = { apiKey: "default-key", timeout: 3000 };
  }

  public static getInstance(): ThreadSafeConfigManager {
    if (!ThreadSafeConfigManager.instance) {
      // Simulação de sincronização (Node.js não é multithread por padrão)
      const instance = new ThreadSafeConfigManager();
      ThreadSafeConfigManager.instance = instance;
    }
    return ThreadSafeConfigManager.instance;
  }

  // Métodos getConfig e setConfig...
}
```

### Usar Factory com Injeção

```typescript
class ConfigFactory {
  static createConfig(service?: ConfigService): ConfigService {
    return service || new ConfigManagerInjected();
  }
}
```

## 📚 Conceitos Aplicados

- **Singleton**: Centraliza a instância, mas expõe riscos.
- **DIP**: A alternativa usa `ConfigService` para abstração.
- **SRP**: O Singleton viola ao misturar instanciamento e lógica.
- **OCP**: Difícil de estender; a injeção resolve isso.

## 🎓 Aprendizados

1. **Riscos de Concorrência**: Multithreading exige sincronização complexa.
2. **Testabilidade**: Singleton dificulta isolamento; injeção é preferível.
3. **Design Robusto**: Abstrações (DIP) superam o Singleton em flexibilidade.

## 🔄 Próximos Passos

- [ ] Implementar sincronização real com `Mutex` ou `Promise` para multithreading.
- [ ] Adicionar suporte a múltiplas configurações (ex.: por ambiente).
- [ ] Integrar com o sistema de pedidos (Order) usando injeção.

---

**💡 Dica**: O Singleton é como um porteiro único em um prédio movimentado. Funciona bem com poucos visitantes, mas em horários de pico (multithreading) ou com testes (isolamento), pode falhar. Use injeção de dependência para um design mais seguro e escalável!
