# 🔌 Interface Segregation Principle (ISP)

Este projeto demonstra a aplicação prática do **Interface Segregation Principle (ISP)** em um sistema de métodos de pagamento, mostrando como interfaces específicas são melhores que uma interface geral.

## 🎯 Objetivo do Estudo

### Interface Segregation Principle (ISP)
- **"Muitas interfaces específicas são melhores que uma interface geral"**
- **"Classes não devem ser forçadas a implementar métodos que não usam"**
- **"Interfaces devem ser coesas e focadas em uma responsabilidade"**

## 📁 Estrutura do Projeto

```
src/
├── contracts/
│   ├── payment-method-interface.ts      # 🔌 Interface de Pagamento
│   ├── generate-document-interface.ts   # 🔌 Interface de Documento
│   └── generate-qr-code-interface.ts    # 🔌 Interface de QR Code
├── credit-card.ts                       # 💳 Implementação Cartão de Crédito
├── boleto.ts                           # 🧾 Implementação Boleto
├── pix.ts                              # 📱 Implementação PIX
└── example.ts                          # 📖 Exemplos de Uso
```

## 🔍 Como Funciona

### 1. Interfaces Segregadas (Solução ISP)
```typescript
// Interface específica para pagamento
interface IPaymentMethod {
    pay(amount: number, description: string): void;
}

// Interface específica para geração de documentos
interface IGenerateDocument {
    generateDocument(amount: number, description: string): string;
}

// Interface específica para geração de QR Code
interface IGenerateQrCode {
    generateQrCode(amount: number, description: string): string;
}
```

### 2. Implementações Específicas
```typescript
// Cartão de Crédito: Pagamento + Documento
export class CreditCard implements IPaymentMethod, IGenerateDocument {
    public pay(amount: number, description: string): void { /* ... */ }
    public generateDocument(amount: number, description: string): string { /* ... */ }
}

// PIX: Pagamento + QR Code
export class Pix implements IPaymentMethod, IGenerateQrCode {
    public pay(amount: number, description: string): void { /* ... */ }
    public generateQrCode(amount: number, description: string): string { /* ... */ }
}
```

## ❌ Problema (Violação do ISP)

### Interface Monolítica (ANTES)
```typescript
interface IPaymentMethod {
    pay(): void;
    generateDocument(): void;  // Cartão e Boleto precisam
    generateQrCode(): void;    // Apenas PIX precisa
}
```

**Problemas:**
- Cartão de crédito é forçado a implementar `generateQrCode()` (não usa)
- PIX é forçado a implementar `generateDocument()` (não usa)
- Boleto é forçado a implementar `generateQrCode()` (não usa)

## ✅ Solução (Aplicando ISP)

### Interfaces Segregadas (DEPOIS)
```typescript
interface IPaymentMethod {
    pay(amount: number, description: string): void;
}

interface IGenerateDocument {
    generateDocument(amount: number, description: string): string;
}

interface IGenerateQrCode {
    generateQrCode(amount: number, description: string): string;
}
```

**Benefícios:**
- Cada classe implementa apenas o que realmente precisa
- Interfaces coesas e focadas
- Fácil manutenção e extensão

## 💡 Benefícios Demonstrados

### ✅ Flexibilidade
- Cartão de crédito não é forçado a gerar QR Code
- PIX não é forçado a gerar documento tradicional
- Boleto não é forçado a gerar QR Code

### ✅ Manutenibilidade
- Mudanças em uma interface não afetam outras
- Adicionar novos métodos não quebra implementações existentes

### ✅ Testabilidade
- Testes mais específicos e focados
- Mocks mais simples e precisos

### ✅ Extensibilidade
- Novos métodos de pagamento podem implementar apenas o necessário
- Novas funcionalidades podem ser adicionadas sem afetar o existente

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar exemplos
npm run example

# Executar em modo desenvolvimento
npm run dev

# Compilar
npm run build

# Executar versão compilada
npm start
```

## 📖 Exemplo Completo de Uso

```typescript
import { CreditCard } from "./credit-card";
import { Boleto } from "./boleto";
import { Pix } from "./pix";

// Cartão de Crédito
const creditCard = new CreditCard();
creditCard.pay(150.00, "Compra online");
creditCard.generateDocument(150.00, "Compra online");
// creditCard.generateQrCode(); // ❌ Erro! Não implementa

// PIX
const pix = new Pix();
pix.pay(75.50, "Transferência");
pix.generateQrCode(75.50, "Transferência");
// pix.generateDocument(); // ❌ Erro! Não implementa

// Boleto
const boleto = new Boleto();
boleto.pay(200.00, "Pagamento de conta");
boleto.generateDocument(200.00, "Pagamento de conta");
// boleto.generateQrCode(); // ❌ Erro! Não implementa
```

## 🧪 Testando os Benefícios

### Cenário 1: Adicionar Novo Método de Pagamento
```typescript
// Novo método: Transferência Bancária
export class BankTransfer implements IPaymentMethod, IGenerateDocument {
    public pay(amount: number, description: string): void {
        // Implementação específica
    }
    
    public generateDocument(amount: number, description: string): string {
        // Implementação específica
    }
    // NÃO implementa IGenerateQrCode (não precisa)
}
```

### Cenário 2: Adicionar Nova Funcionalidade
```typescript
// Nova interface: Geração de Comprovante Digital
interface IGenerateDigitalReceipt {
    generateDigitalReceipt(amount: number, description: string): string;
}

// Apenas métodos que precisam implementam
export class CreditCard implements IPaymentMethod, IGenerateDocument, IGenerateDigitalReceipt {
    // Implementações...
}
```

## 📚 Conceitos Aplicados

### Interface Segregation Principle
- **Problema**: Interface monolítica força implementações desnecessárias
- **Solução**: Interfaces segregadas e específicas
- **Resultado**: Classes implementam apenas o que precisam

### Benefícios do ISP
- **Coesão**: Interfaces focadas em uma responsabilidade
- **Desacoplamento**: Mudanças não afetam implementações desnecessárias
- **Flexibilidade**: Implementações específicas para cada necessidade

## 🎓 Aprendizados

1. **Interfaces específicas são melhores**: Cada interface tem uma responsabilidade clara
2. **Evite interfaces monolíticas**: Não force implementações desnecessárias
3. **Pense na responsabilidade**: Cada interface deve ter um propósito específico
4. **Facilite a manutenção**: Mudanças em uma interface não afetam outras

## 🔄 Próximos Passos

- [ ] Implementar testes unitários
- [ ] Adicionar mais métodos de pagamento
- [ ] Criar exemplos de violação do ISP
- [ ] Implementar validações
- [ ] Adicionar logging e tratamento de erros

---

**💡 Dica**: O ISP nos ensina que é melhor ter muitas interfaces específicas do que uma interface geral que força implementações desnecessárias. Isso torna o código mais flexível, testável e manutenível. 