# 🎯 Design Patterns & Clean Code Study Project

Este projeto foi criado para estudar e praticar os princípios fundamentais de desenvolvimento de software, incluindo **SOLID**, **DDD (Domain-Driven Design)**, **Clean Architecture** e os **padrões de projeto do GoF (Gang of Four)**.

## 📚 O que você vai aprender aqui

### 🏗️ Princípios SOLID

Os princípios SOLID são fundamentais para escrever código limpo e manutenível:

- **S** - **Single Responsibility Principle (SRP)**: Uma classe deve ter apenas uma razão para mudar
- **O** - **Open/Closed Principle (OCP)**: Aberto para extensão, fechado para modificação
- **L** - **Liskov Substitution Principle (LSP)**: Objetos de uma superclasse devem poder ser substituídos por objetos de suas subclasses
- **I** - **Interface Segregation Principle (ISP)**: Muitas interfaces específicas são melhores que uma interface geral
- **D** - **Dependency Inversion Principle (DIP)**: Dependa de abstrações, não de implementações concretas

### 🎯 Domain-Driven Design (DDD)

DDD é uma abordagem para o desenvolvimento de software que coloca o foco no domínio do negócio:

- **Entidades**: Objetos com identidade única
- **Value Objects**: Objetos imutáveis que representam conceitos do domínio
- **Aggregates**: Clusters de objetos relacionados
- **Repositories**: Abstração para persistência de dados
- **Services**: Lógica de domínio que não pertence a uma entidade específica

### 🏛️ Clean Architecture

Uma arquitetura que separa as responsabilidades em camadas:

- **Entities**: Regras de negócio centrais
- **Use Cases**: Casos de uso da aplicação
- **Interface Adapters**: Controllers, Presenters, Gateways
- **Frameworks & Drivers**: UI, DB, Web, etc.

### 🎨 Padrões de Projeto (GoF)

Os 23 padrões de projeto clássicos divididos em três categorias:

#### Padrões Criacionais
- **Singleton**: Garantir uma única instância
- **Factory Method**: Criar objetos sem especificar classes concretas
- **Abstract Factory**: Criar famílias de objetos relacionados
- **Builder**: Construir objetos complexos passo a passo
- **Prototype**: Criar novos objetos clonando um protótipo

#### Padrões Estruturais
- **Adapter**: Permitir que interfaces incompatíveis trabalhem juntas
- **Bridge**: Separar abstração da implementação
- **Composite**: Compor objetos em estruturas de árvore
- **Decorator**: Adicionar responsabilidades dinamicamente
- **Facade**: Fornecer uma interface unificada para subsistemas
- **Flyweight**: Compartilhar objetos para reduzir uso de memória
- **Proxy**: Controlar acesso a objetos

#### Padrões Comportamentais
- **Chain of Responsibility**: Passar requisições por uma cadeia de handlers
- **Command**: Encapsular uma requisição como objeto
- **Iterator**: Acessar elementos de uma coleção sem expor sua estrutura
- **Mediator**: Definir como objetos se comunicam
- **Memento**: Capturar e restaurar estado interno
- **Observer**: Notificar mudanças de estado
- **State**: Permitir que um objeto altere seu comportamento
- **Strategy**: Definir uma família de algoritmos
- **Template Method**: Definir esqueleto de algoritmo
- **Visitor**: Separar algoritmo da estrutura de dados

## 🚀 Projeto Atual: Dependency Inversion + Adapter Pattern

O projeto atual demonstra a aplicação do **Princípio da Inversão de Dependência (DIP)** junto com o **Padrão Adapter**.

### 📁 Estrutura do Projeto

```
solid-dependency-inversion-adapter/
├── src/
│   ├── payment-gateway.interface.ts    # Interface (Abstração)
│   ├── order.ts                        # Entidade de Domínio
│   ├── order-processor.ts              # Serviço de Aplicação
│   ├── stripe-gateway-payment.ts       # Adapter para Stripe
│   ├── mercado-pago-gateway-payment.ts # Adapter para Mercado Pago
│   ├── stripe.ts                       # Cliente Stripe
│   └── mercado-pago.ts                 # Cliente Mercado Pago
├── package.json
└── tsconfig.json
```

### 🔍 Como Funciona

1. **Interface `IPaymentGateway`**: Define o contrato que todos os gateways de pagamento devem seguir
2. **`OrderProcessorService`**: Depende da abstração (interface), não de implementações concretas
3. **Adapters**: `StripeGatewayPayment` e `MercadoPagoPaymentGateway` implementam a interface, adaptando APIs externas

### 💡 Benefícios Demonstrados

- **Flexibilidade**: Fácil troca entre gateways de pagamento
- **Testabilidade**: Possibilidade de mockar a interface
- **Manutenibilidade**: Mudanças em um gateway não afetam outros
- **Extensibilidade**: Novos gateways podem ser adicionados facilmente

## 🛠️ Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Compilar
npm run build

# Executar versão compilada
npm start
```

## 📖 Exemplos de Uso

```typescript
// Usando Stripe
const stripeGateway = new StripeGatewayPayment();
const orderProcessor = new OrderProcessorService(stripeGateway);

// Usando Mercado Pago
const mercadoPagoGateway = new MercadoPagoPaymentGateway();
const orderProcessor = new OrderProcessorService(mercadoPagoGateway);

// Processar pedido
const order = new Order("123", "user456", [], 100);
orderProcessor.process(order);
```

## 🎓 Próximos Passos

Este projeto será expandido para incluir:

- [ ] Implementação de outros padrões GoF
- [ ] Exemplos de Clean Architecture
- [ ] Casos práticos de DDD
- [ ] Testes unitários demonstrando os benefícios
- [ ] Documentação de cada padrão implementado

## 📚 Recursos de Aprendizado

### Livros Recomendados
- **"Design Patterns"** - Gang of Four
- **"Clean Code"** - Robert C. Martin
- **"Domain-Driven Design"** - Eric Evans
- **"Clean Architecture"** - Robert C. Martin

### Artigos e Vídeos
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🤝 Contribuindo

Sinta-se à vontade para contribuir com:
- Implementações de novos padrões
- Melhorias na documentação
- Exemplos práticos adicionais
- Correções e sugestões

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença ISC.

---

**Lembre-se**: O objetivo deste projeto é educacional. Os padrões demonstrados aqui são ferramentas poderosas, mas devem ser aplicados com sabedoria, considerando sempre o contexto e as necessidades específicas do seu projeto. 