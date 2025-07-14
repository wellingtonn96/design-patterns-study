/**
 * 🏢 CLIENTE STRIPE - Adaptee do Padrão Adapter
 * 
 * Esta classe simula o cliente oficial do Stripe.
 * Em um projeto real, seria a biblioteca oficial do Stripe.
 * 
 * Esta é a "interface existente" que o Adapter precisa adaptar
 * para nossa interface IPaymentGateway.
 */

/**
 * Interface para os parâmetros de criação de charge no Stripe
 */
interface StripeChargeParams {
  amount: number;      // Valor em centavos
  currency: string;    // Código da moeda (ex: "BRL", "USD")
  source: string;      // Token do cartão
  description: string; // Descrição da transação
}

/**
 * Cliente simulado do Stripe
 * Em produção, seria a biblioteca oficial: import Stripe from 'stripe'
 */
export class StripeClient {
  constructor(private apiKey: string) {
    // Em produção, inicializaria o cliente Stripe com a chave da API
    console.log(`Stripe client initialized with API key: ${apiKey}`);
  }

  /**
   * Cria uma charge (cobrança) no Stripe
   * @param params - Parâmetros da transação
   */
  createCharge(params: StripeChargeParams): void {
    // Simula a criação de uma charge no Stripe
    console.log("🔵 Stripe: Processando pagamento...");
    console.log(`   Valor: R$ ${(params.amount / 100).toFixed(2)}`);
    console.log(`   Moeda: ${params.currency}`);
    console.log(`   Descrição: ${params.description}`);
    console.log("   ✅ Pagamento processado com sucesso!");
  }
}
