import { IGenerateQrCode } from "./contracts/generate-qr-code-interface";
import { IPaymentMethod } from "./contracts/payment-method-interface";

/**
 * 📱 PIX - Interface Segregation Principle (ISP)
 * 
 * Esta classe implementa apenas as interfaces que realmente precisa:
 * - IPaymentMethod: Para processar pagamentos
 * - IGenerateQrCode: Para gerar QR Code do PIX
 * 
 * NÃO implementa IGenerateDocument porque PIX não gera
 * documentos tradicionais - isso seria uma violação do ISP.
 */
export class Pix implements IPaymentMethod, IGenerateQrCode {
    /**
     * Processa pagamento com PIX
     * @param amount - Valor a ser pago
     * @param description - Descrição do pagamento
     */
    public pay(amount: number, description: string): void {
        console.log("📱 PIX: Processando pagamento...");
        console.log(`   Valor: R$ ${amount.toFixed(2)}`);
        console.log(`   Descrição: ${description}`);
        console.log("   ✅ PIX processado com sucesso!");
    }

    /**
     * Gera QR Code do PIX
     * @param amount - Valor do pagamento
     * @param description - Descrição do pagamento
     * @returns QR Code em formato string
     */
    public generateQrCode(amount: number, description: string): string {
        const qrCode = `
=== QR CODE PIX ===
00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913Empresa Exemplo6009Sao Paulo62070503***6304E2CA
Valor: R$ ${amount.toFixed(2)}
Descrição: ${description}
===============================
        `;
        
        console.log("📱 Gerando QR Code do PIX...");
        console.log(qrCode);
        
        return qrCode;
    }
}   