# 🔍 Princípio da Substituição de Liskov (LSP)

Este projeto demonstra, de forma simples e prática, o **Princípio da Substituição de Liskov (LSP)**, um dos cinco princípios SOLID, com exemplos didáticos em TypeScript.

## 🎯 O que é o LSP?

O LSP é como uma **máquina de brinquedos** que promete: "Todo brinquedo que eu faço brilha quando você aperta o botão." Se você troca um brinquedo por outro, ele ainda deve brilhar, sem fazer algo diferente (como piscar ou precisar de uma bateria extra). Na programação, isso significa que uma classe derivada (subclasse) pode ser usada no lugar da classe base sem mudar o que o programa espera. Em outras palavras:

**"Subtipos devem ser substituíveis por seus tipos base sem quebrar o comportamento esperado."**

Se uma subclasse não cumpre as "promessas" da classe base (ex.: regras, entradas ou saídas), ela viola o LSP, e o programa pode se comportar de forma inesperada.

## 🏗️ Estrutura do Projeto

```
3-liskov-substitution-principle/
├── src/
│   ├── invariance/         # Exemplo de violação por invariância
│   ├── pre-condition/      # Exemplo de violação por pré-condição
│   └── post-condition/     # Exemplo de violação por pós-condição
├── example.ts              # Executa todos os exemplos
├── tsconfig.json           # Configuração do TypeScript
├── package.json            # Dependências e scripts
└── README.md               # Esta documentação
```

## 📚 Exemplos Didáticos e Explicações

### 1. ❌ Invariância

**O que é?** Uma invariância é uma regra que nunca pode ser quebrada (ex.: uma caixa de doces nunca pode ter menos que zero doces). Se uma subclasse muda essa regra, ela viola o LSP.

**Exemplo INCORRETO (viola o LSP):**

Imagine uma conta bancária que promete: "O saldo nunca pode ficar negativo." A subclasse permite saldo negativo, quebrando essa promessa.

```typescript
class BankAccount {
  protected balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser maior que 0");
    if (amount > this.balance) throw new Error("Saldo insuficiente");
    this.balance -= amount;
    console.log(`✅ Saque: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

class CheckingAccount extends BankAccount {
  private overdraftLimit: number = 1000;

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser maior que 0");
    const available = this.balance + this.overdraftLimit;
    if (amount > available) throw new Error("Limite excedido");
    this.balance -= amount; // ❌ Permite saldo negativo!
    console.log(`❌ Saque: R$ ${amount}, Saldo: R$ ${this.balance} (negativo!)`);
  }
}
```

**Por que está errado?** O código cliente espera que o saldo nunca fique negativo (invariância de `BankAccount`). A `CheckingAccount` permite saldo negativo (ex.: `-500`), surpreendendo o cliente e quebrando o LSP.

**Exemplo CORRETO (respeita o LSP):**

Usamos interfaces específicas para contas com e sem cheque especial, garantindo contratos claros.

```typescript
interface NoOverdraftAccount {
  deposit(amount: number): void; // Aceita valores > 0
  withdraw(amount: number): void; // Não permite saldo negativo
  getBalance(): number;
}

interface OverdraftAccount {
  deposit(amount: number): void; // Aceita valores > 0
  withdraw(amount: number): void; // Permite saldo negativo até o limite
  getBalance(): number;
  getOverdraftLimit(): number;
}

class StandardBankAccount implements NoOverdraftAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser maior que 0");
    if (amount > this.balance) throw new Error("Saldo insuficiente");
    this.balance -= amount;
    console.log(`✅ Saque: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

class OverdraftBankAccount implements OverdraftAccount {
  private balance: number = 0;
  private overdraftLimit: number = 1000;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser maior que 0");
    const available = this.balance + this.overdraftLimit;
    if (amount > available) throw new Error("Limite excedido");
    this.balance -= amount;
    if (this.balance < 0) {
      console.log(`💳 Cheque especial usado: R$ ${-this.balance}`);
    } else {
      console.log(`✅ Saque: R$ ${amount}, Saldo: R$ ${this.balance}`);
    }
  }

  getBalance(): number {
    return this.balance;
  }

  getOverdraftLimit(): number {
    return this.overdraftLimit;
  }
}
```

**Por que está correto?** Cada interface (`NoOverdraftAccount` e `OverdraftAccount`) define um contrato claro. `StandardBankAccount` garante saldo não negativo, enquanto `OverdraftBankAccount` permite saldo negativo até o limite, sem surprender o código cliente.

### 2. ❌ Pré-condição

**O que é?** Uma pré-condição é uma regra sobre o que um método aceita (ex.: "aceito qualquer valor positivo"). Se a subclasse adiciona restrições extras, ela viola o LSP.

**Exemplo INCORRETO (viola o LSP):**

A classe base aceita qualquer depósito positivo, mas a subclasse exige um valor mínimo.

```typescript
class BankAccountPre {
  protected balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

class SavingsAccount extends BankAccountPre {
  deposit(amount: number): void {
    if (amount < 10) throw new Error("Depósito mínimo é R$ 10"); // ❌ Restrição extra!
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }
}
```

**Por que está errado?** O código cliente espera que qualquer valor positivo seja aceito (ex.: `5`). A `SavingsAccount` lança erro para valores abaixo de 10, quebrando o contrato.

**Exemplo CORRETO (respeita o LSP):**

Usamos interfaces específicas para contas com e sem depósito mínimo.

```typescript
interface Depositable {
  deposit(amount: number): void; // Aceita qualquer valor > 0
  getBalance(): number;
}

interface MinimumDepositAccount {
  deposit(amount: number): void; // Exige depósito mínimo
  getBalance(): number;
  getMinimumDeposit(): number;
}

class SafeBasicAccount implements Depositable {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

class SafeSavingsAccount implements MinimumDepositAccount {
  private balance: number = 0;
  private minimumDeposit: number = 10;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    if (amount < this.minimumDeposit) throw new Error("Depósito mínimo é R$ 10");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }

  getMinimumDeposit(): number {
    return this.minimumDeposit;
  }
}
```

**Por que está correto?** A interface `MinimumDepositAccount` explicita que há um depósito mínimo, enquanto `Depositable` aceita qualquer valor positivo. O código cliente usa a interface correta, evitando surpresas.

### 3. ❌ Pós-condição

**O que é?** Uma pós-condição é uma regra sobre o que um método retorna (ex.: "retorno um caminho de arquivo local"). Se a subclasse retorna algo diferente, ela viola o LSP.

**Exemplo INCORRETO (viola o LSP):**

A interface promete retornar um caminho local, mas a subclasse retorna uma URL.

```typescript
interface IFileSaver {
  saveFile(content: string): string; // Deve retornar caminho local
}

class LocalFileSaver implements IFileSaver {
  saveFile(content: string): string {
    console.log(`✅ Salvando arquivo local: ${content}`);
    return "/tmp/file.txt";
  }
}

class CloudFileSaver implements IFileSaver {
  saveFile(content: string): string {
    console.log(`❌ Salvando arquivo na nuvem: ${content}`);
    return "https://cloud.com/file.txt"; // ❌ Retorna URL!
  }
}
```

**Por que está errado?** O código cliente espera um caminho local (ex.: `/tmp/file.txt`), mas `CloudFileSaver` retorna uma URL, quebrando o contrato.

**Exemplo CORRETO (respeita o LSP):**

Usamos interfaces específicas para caminhos locais e URLs.

```typescript
interface LocalFileSaver {
  saveFileLocal(content: string): string; // Retorna caminho local
}

interface CloudFileSaver {
  saveFileCloud(content: string): string; // Retorna URL
}

class SafeLocalFileSaver implements LocalFileSaver {
  saveFileLocal(content: string): string {
    console.log(`✅ Salvando arquivo local: ${content}`);
    return "/tmp/file.txt";
  }
}

class SafeCloudFileSaver implements CloudFileSaver {
  saveFileCloud(content: string): string {
    console.log(`✅ Salvando arquivo na nuvem: ${content}`);
    return "https://cloud.com/file.txt";
  }
}
```

**Por que está correto?** Cada interface define um contrato claro (`saveFileLocal` para caminhos locais, `saveFileCloud` para URLs). O código cliente sabe exatamente o que esperar.

## ✅ Como Respeitar o LSP

- **Use interfaces específicas**: Separe comportamentos diferentes (ex.: contas com e sem cheque especial) em interfaces distintas.
- **Prefira composição a herança**: Evite herança quando as subclasses mudam regras da classe base.
- **Valide entradas**: Sempre cheque valores inválidos (ex.: `amount <= 0`) para evitar comportamentos inesperados.
- **Teste a substituição**: Certifique-se de que qualquer implementação pode ser usada sem quebrar o código cliente.

## 🧪 Como Testar

Teste se as implementações respeitam os contratos das interfaces:

```typescript
// Teste Invariância
console.log("\n❌ Teste Invariância (Incorreto)");
try {
  const badAccount: BankAccount = new CheckingAccount();
  badAccount.deposit(500);
  badAccount.withdraw(1500); // ❌ Permite saldo negativo!
} catch (e) {
  console.log(`Erro: ${e.message}`);
}

console.log("\n✅ Teste Invariância (Correto)");
try {
  const goodAccount: OverdraftAccount = new OverdraftBankAccount();
  goodAccount.deposit(500);
  goodAccount.withdraw(1500); // ✅ Usa cheque especial
} catch (e) {
  console.log(`Erro: ${e.message}`);
}

// Teste Pré-condição
console.log("\n❌ Teste Pré-condição (Incorreto)");
try {
  const badSavings: BankAccountPre = new SavingsAccount();
  badSavings.deposit(5); // ❌ Lança erro por depósito mínimo
} catch (e) {
  console.log(`Erro: ${e.message}`);
}

console.log("\n✅ Teste Pré-condição (Correto)");
try {
  const goodSavings: MinimumDepositAccount = new SafeSavingsAccount();
  goodSavings.deposit(5); // ❌ Lança erro, mas contrato é claro
} catch (e) {
  console.log(`Erro: ${e.message}`);
}

// Teste Pós-condição
console.log("\n❌ Teste Pós-condição (Incorreto)");
function testFileSaver(saver: IFileSaver) {
  const path = saver.saveFile("conteúdo");
  if (path.startsWith("/")) {
    console.log(`✅ Arquivo local: ${path}`);
  } else {
    console.log(`❌ Esperava caminho local, recebeu: ${path}`);
  }
}
testFileSaver(new LocalFileSaver());
testFileSaver(new CloudFileSaver());

console.log("\n✅ Teste Pós-condição (Correto)");
function testLocalFileSaver(saver: LocalFileSaver) {
  const path = saver.saveFileLocal("conteúdo");
  console.log(`✅ Arquivo local: ${path}`);
}
function testCloudFileSaver(saver: CloudFileSaver) {
  const url = saver.saveFileCloud("conteúdo");
  console.log(`✅ Arquivo na nuvem: ${url}`);
}
testLocalFileSaver(new SafeLocalFileSaver());
testCloudFileSaver(new SafeCloudFileSaver());
```

## 🚀 Como Executar

1. **Pré-requisitos**:
   - Node.js instalado (v16 ou superior).
   - TypeScript instalado globalmente (`npm install -g typescript`).

2. **Configuração**:
   ```bash
   # Clone o repositório
   git clone <url-do-repositorio>
   cd 3-liskov-substitution-principle

   # Instale dependências
   npm install
   ```

3. **Executar exemplos**:
   ```bash
   # Todos os exemplos
   npm run example

   # Exemplos individuais
   npm run invariance
   npm run pre-condition
   npm run post-condition
   ```

4. **Estrutura do `package.json`**:
   ```json
   {
     "scripts": {
       "example": "ts-node src/example.ts",
       "invariance": "ts-node src/invariance/index.ts",
       "pre-condition": "ts-node src/pre-condition/index.ts",
       "post-condition": "ts-node src/post-condition/index.ts"
     },
     "dependencies": {
       "ts-node": "^10.9.1",
       "typescript": "^4.9.5"
     }
   }
   ```

5. **Configuração do `tsconfig.json`**:
   ```json
   {
     "compilerOptions": {
       "target": "es6",
       "module": "commonjs",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true
     }
   }
   ```

## 💡 Dicas para Iniciantes

- **Pense em promessas**: Cada classe ou interface faz uma promessa (contrato). Subclasses devem cumprir essa promessa sem mudar as regras.
- **Teste a substituição**: Se trocar uma classe por outra quebra o programa, você violou o LSP.
- **Use composição**: Quando o comportamento diverge muito, prefira composição (uma classe dentro da outra) a herança.
- **Interfaces claras**: Crie interfaces específicas para cada tipo de comportamento (ex.: contas com e sem cheque especial).

## 🎓 Benefícios do LSP

- **Código confiável**: Evita surpresas quando uma classe é substituída por outra.
- **Testes simples**: Comportamentos previsíveis facilitam testes automatizados.
- **Manutenção fácil**: Interfaces claras tornam o código mais fácil de entender e estender.

**Lembre-se**: O LSP é sobre comportamento, não apenas herança. Se uma subclasse não pode substituir a base sem quebrar o sistema, repense o design!