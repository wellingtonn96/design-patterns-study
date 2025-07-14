/**
 * 🏢 CLIENTE MERCADO PAGO - Adaptee do Padrão Adapter
 * 
 * Esta classe simula o cliente oficial do Mercado Pago.
 * Em um projeto real, seria a biblioteca oficial do Mercado Pago.
 * 
 * Esta é a "interface existente" que o Adapter precisa adaptar
 * para nossa interface IPaymentGateway.
 */

/**
 * Interface para configuração do cliente Mercado Pago
 */
interface MercadoPagoConfig {
  accessToken: string; // Token de acesso da API
  baseUrl: string;     // URL base da API
}

/**
 * Interface para os dados do pagador
 */
interface MercadoPagoPayer {
  email: string;
  identification: {
    number: string; // CPF/CNPJ
    type: string;   // Tipo de documento (CPF, CNPJ)
  };
}

/**
 * Interface para criação de pagamento no Mercado Pago
 */
interface MercadoPagoPaymentParams {
  description: string;
  installments: number;
  payer: MercadoPagoPayer;
  payment_method_id: string;
  token: string;
  transaction_amount: number;
}

/**
 * Cliente simulado do Mercado Pago
 * Em produção, seria a biblioteca oficial do Mercado Pago
 */
export class MercadoPagoAPI {
  constructor(private config: MercadoPagoConfig) {
    // Em produção, inicializaria o cliente Mercado Pago com as credenciais
    console.log(`Mercado Pago client initialized with access token: ${config.accessToken}`);
  }

  /**
   * Cria um pagamento no Mercado Pago
   * @param params - Parâmetros do pagamento
   */
  createPayment(params: MercadoPagoPaymentParams): void {
    // Simula a criação de um pagamento no Mercado Pago
    console.log("🟡 Mercado Pago: Processando pagamento...");
    console.log(`   Valor: R$ ${params.transaction_amount.toFixed(2)}`);
    console.log(`   Parcelas: ${params.installments}x`);
    console.log(`   Método: ${params.payment_method_id}`);
    console.log(`   Cliente: ${params.payer.email}`);
    console.log(`   Descrição: ${params.description}`);
    console.log("   ✅ Pagamento processado com sucesso!");
  }
}
