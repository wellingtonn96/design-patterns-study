import { IGenerateDocument } from "./contracts/generate-document-interface";
import { IPaymentMethod } from "./contracts/payment-method-interface";

/**
 * 💳 CARTÃO DE CRÉDITO - Interface Segregation Principle (ISP)
 * 
 * Esta classe implementa apenas as interfaces que realmente precisa:
 * - IPaymentMethod: Para processar pagamentos
 * - IGenerateDocument: Para gerar comprovantes
 * 
 * NÃO implementa IGenerateQrCode porque cartão de crédito
 * não gera QR Code - isso seria uma violação do ISP.
 */
export class CreditCard implements IPaymentMethod, IGenerateDocument {
    /**
     * Processa pagamento com cartão de crédito
     * @param amount - Valor a ser pago
     * @param description - Descrição do pagamento
     */
    public pay(amount: number, description: string): void {
        console.log("💳 Cartão de Crédito: Processando pagamento...");
        console.log(`   Valor: R$ ${amount.toFixed(2)}`);
        console.log(`   Descrição: ${description}`);
        console.log("   ✅ Pagamento aprovado!");
    }

    /**
     * Gera comprovante de pagamento com cartão de crédito
     * @param amount - Valor do pagamento
     * @param description - Descrição do pagamento
     * @returns Comprovante em formato string
     */
    public generateDocument(amount: number, description: string): string {
        const document = `
=== COMPROVANTE DE PAGAMENTO ===
Método: Cartão de Crédito
Valor: R$ ${amount.toFixed(2)}
Descrição: ${description}
Data: ${new Date().toLocaleString()}
Status: Aprovado
===============================
        `;
        
        console.log("📄 Gerando comprovante de cartão de crédito...");
        console.log(document);
        
        return document;
    }
}