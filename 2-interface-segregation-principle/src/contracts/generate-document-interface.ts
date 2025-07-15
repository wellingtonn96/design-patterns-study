/**
 * 🔌 INTERFACE - Geração de Documento
 * 
 * Interface específica para métodos que geram documentos.
 * Segue o Interface Segregation Principle (ISP):
 * "Muitas interfaces específicas são melhores que uma interface geral"
 * 
 * Esta interface contém apenas os métodos relacionados à geração de documentos,
 * permitindo que apenas as classes que realmente precisam implementem.
 */
export interface IGenerateDocument {
    /**
     * Gera um documento de pagamento
     * @param amount - Valor do pagamento
     * @param description - Descrição do pagamento
     * @returns String contendo o documento gerado
     */
    generateDocument(amount: number, description: string): string;
}