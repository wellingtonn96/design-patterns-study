/**
 * 🔌 INTERFACE - Método de Pagamento
 * 
 * Interface específica para métodos de pagamento.
 * Segue o Interface Segregation Principle (ISP):
 * "Muitas interfaces específicas são melhores que uma interface geral"
 * 
 * Esta interface contém apenas os métodos relacionados ao pagamento,
 * sem forçar implementações desnecessárias.
 */
export interface IPaymentMethod {
    /**
     * Processa o pagamento
     * @param amount - Valor a ser pago
     * @param description - Descrição do pagamento
     */
    pay(amount: number, description: string): void;
}
