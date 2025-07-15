/**
 * 🔌 INTERFACE - Geração de QR Code
 * 
 * Interface específica para métodos que geram QR Code.
 * Segue o Interface Segregation Principle (ISP):
 * "Muitas interfaces específicas são melhores que uma interface geral"
 * 
 * Esta interface contém apenas os métodos relacionados à geração de QR Code,
 * permitindo que apenas as classes que realmente precisam implementem.
 */
export interface IGenerateQrCode {
    /**
     * Gera um QR Code para pagamento
     * @param amount - Valor do pagamento
     * @param description - Descrição do pagamento
     * @returns String contendo o QR Code
     */
    generateQrCode(amount: number, description: string): string;
}