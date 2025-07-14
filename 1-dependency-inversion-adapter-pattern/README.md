# 🔄 Dependency Inversion Principle + Adapter Pattern

Este projeto demonstra a aplicação prática do **Princípio da Inversão de Dependência (DIP)** junto com o **Padrão Adapter** em um sistema de processamento de pedidos com múltiplos gateways de pagamento.

## 🎯 Objetivo do Estudo

### Dependency Inversion Principle (DIP)
- **Dependa de abstrações, não de implementações concretas**
- **Módulos de alto nível não devem depender de módulos de baixo nível**
- **Ambos devem depender de abstrações**

### Adapter Pattern
- **Permite que interfaces incompatíveis trabalhem juntas**
- **Encapsula a complexidade de integração com APIs externas**
- **Mantém o código cliente limpo e desacoplado**

## 📁 Estrutura do Projeto

```
src/
├── payment-gateway.interface.ts    # 🔌 Interface (Abstração)
├── order.ts                        # 📦 Entidade de Domínio
├── order-processor.ts              # ⚙️ Serviço de Aplicação
├── stripe-gateway-payment.ts       # 🔌 Adapter para Stripe
├── mercado-pago-gateway-payment.ts # 🔌 Adapter para Mercado Pago
├── stripe.ts                       # 🏢 Cliente Stripe
├── mercado-pago.ts                 # 🏢 Cliente Mercado Pago
└── example.ts                      # 📖 Exemplos de Uso
```

## 🔍 Como Funciona

### 1. Interface (Abstração)
```typescript
// payment-gateway.interface.ts
export interface IPaymentGateway {
  pay(order: Order): void;
}
```
- Define o contrato que todos os gateways devem seguir
- Permite que diferentes implementações sejam intercambiáveis

### 2. Serviço de Aplicação
```typescript
// order-processor.ts
export class OrderProcessorService {
  constructor(private gatewayPayment: IPaymentGateway) {}
  
  public process(order: Order) {
    this.gatewayPayment.pay(order);
  }
}
```
- **Depende da abstração** (`IPaymentGateway`), não de implementações concretas
- **Injeção de dependência** via construtor
- **Fácil de testar** com mocks

### 3. Adapters (Implementações)
```typescript
// stripe-gateway-payment.ts
export class StripeGatewayPayment implements IPaymentGateway {
  public pay(order: Order) {
    // Adapta a API do Stripe para nossa interface
  }
}

// mercado-pago-gateway-payment.ts
export class MercadoPagoPaymentGateway implements IPaymentGateway {
  public pay(order: Order) {
    // Adapta a API do Mercado Pago para nossa interface
  }
}
```

## 💡 Benefícios Demonstrados

### ✅ Flexibilidade
```typescript
// Fácil troca entre gateways
const stripeGateway = new StripeGatewayPayment();
const mercadoPagoGateway = new MercadoPagoPaymentGateway();

// Mesmo serviço funciona com qualquer gateway
const processor1 = new OrderProcessorService(stripeGateway);
const processor2 = new OrderProcessorService(mercadoPagoGateway);
```

### ✅ Testabilidade
```typescript
// Mock para testes
class MockPaymentGateway implements IPaymentGateway {
  public pay(order: Order): void {
    // Simula pagamento para testes
  }
}

const mockGateway = new MockPaymentGateway();
const processor = new OrderProcessorService(mockGateway);
```

### ✅ Manutenibilidade
- Mudanças em um gateway não afetam outros
- Novos gateways podem ser adicionados sem modificar código existente
- Código cliente permanece estável

### ✅ Extensibilidade
```typescript
// Adicionar novo gateway é simples
export class PayPalGatewayPayment implements IPaymentGateway {
  public pay(order: Order): void {
    // Implementação para PayPal
  }
}
```

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
import { Order, OrderItem } from './order';
import { OrderProcessorService } from './order-processor';
import { StripeGatewayPayment } from './stripe-gateway-payment';
import { MercadoPagoPaymentGateway } from './mercado-pago-gateway-payment';

// Criar pedido
const items = [
  new OrderItem("item1", "prod123", 50.00, 2),
  new OrderItem("item2", "prod456", 25.00, 1)
];

const order = new Order("order123", "user456", items, 125.00);

// Usar Stripe
const stripeGateway = new StripeGatewayPayment();
const stripeProcessor = new OrderProcessorService(stripeGateway);
stripeProcessor.process(order);

// Usar Mercado Pago
const mercadoPagoGateway = new MercadoPagoPaymentGateway();
const mercadoPagoProcessor = new OrderProcessorService(mercadoPagoGateway);
mercadoPagoProcessor.process(order);
```

## 🧪 Testando os Benefícios

### Cenário 1: Troca de Gateway
```typescript
// Configuração inicial com Stripe
const processor = new OrderProcessorService(new StripeGatewayPayment());

// Troca para Mercado Pago sem modificar código cliente
processor.gatewayPayment = new MercadoPagoPaymentGateway();
```

### Cenário 2: Adição de Novo Gateway
```typescript
// Novo gateway implementa a mesma interface
export class PayPalGatewayPayment implements IPaymentGateway {
  public pay(order: Order): void {
    // Implementação PayPal
  }
}

// Uso imediato sem modificações
const paypalProcessor = new OrderProcessorService(new PayPalGatewayPayment());
```

## 📚 Conceitos Aplicados

### Dependency Inversion Principle
- **Alto nível**: `OrderProcessorService`
- **Baixo nível**: `StripeGatewayPayment`, `MercadoPagoPaymentGateway`
- **Abstração**: `IPaymentGateway`
- **Resultado**: Alto nível não depende de baixo nível

### Adapter Pattern
- **Target**: `IPaymentGateway` (interface desejada)
- **Adaptee**: APIs do Stripe e Mercado Pago (interfaces existentes)
- **Adapter**: `StripeGatewayPayment`, `MercadoPagoPaymentGateway`
- **Client**: `OrderProcessorService`

## 🎓 Aprendizados

1. **Abstrações são poderosas**: Uma interface bem definida permite flexibilidade extrema
2. **Injeção de dependência**: Facilita testes e manutenção
3. **Desacoplamento**: Mudanças em uma parte não afetam outras
4. **Extensibilidade**: Novos comportamentos podem ser adicionados facilmente

## 🔄 Próximos Passos

- [ ] Implementar testes unitários
- [ ] Adicionar mais gateways de pagamento
- [ ] Implementar logging e tratamento de erros
- [ ] Criar factory para gateways
- [ ] Adicionar validações de pedido

---

**💡 Dica**: Este exemplo demonstra como princípios SOLID e padrões de projeto trabalham juntos para criar código limpo, testável e manutenível. 