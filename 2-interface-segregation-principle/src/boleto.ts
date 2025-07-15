import { IGenerateDocument } from "./contracts/generate-document-interface";
import { IPaymentMethod } from "./contracts/payment-method-interface";

/**
 * 🧾 BOLETO - Interface Segregation Principle (ISP)
 * 
 * Esta classe implementa apenas as interfaces que realmente precisa:
 * - IPaymentMethod: Para processar pagamentos
 * - IGenerateDocument: Para gerar boletos
 * 
 * NÃO implementa IGenerateQrCode porque boleto tradicional
 * não gera QR Code - isso seria uma violação do ISP.
 */
export class Boleto implements IPaymentMethod, IGenerateDocument {
    /**
     * Processa pagamento com boleto
     * @param amount - Valor a ser pago
     * @param description - Descrição do pagamento
     */
    public pay(amount: number, description: string): void {
        console.log("🧾 Boleto: Processando pagamento...");
        console.log(`   Valor: R$ ${amount.toFixed(2)}`);
        console.log(`   Descrição: ${description}`);
        console.log("   ✅ Boleto gerado com sucesso!");
    }

    /**
     * Gera boleto bancário
     * @param amount - Valor do pagamento
     * @param description - Descrição do pagamento
     * @returns Boleto em formato string
     */
    public generateDocument(amount: number, description: string): string {
        const boleto = `
=== BOLETO BANCÁRIO ===
Código de Barras: 12345.67890 12345.678901 12345.678901 1 12345678901234
Valor: R$ ${amount.toFixed(2)}
Vencimento: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
Descrição: ${description}
Beneficiário: Empresa Exemplo LTDA
===============================
        `;
        
        console.log("📄 Gerando boleto bancário...");
        console.log(boleto);
        
        return boleto;
    }
}   