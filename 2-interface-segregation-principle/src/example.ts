/**
 * 📖 EXEMPLO DE USO - Interface Segregation Principle (ISP)
 * 
 * Este arquivo demonstra como aplicar o ISP em diferentes métodos de pagamento,
 * mostrando como interfaces específicas são melhores que uma interface geral.
 */

import { CreditCard } from "./credit-card";
import { Boleto } from "./boleto";
import { Pix } from "./pix";

/**
 * Função que demonstra pagamento com cartão de crédito
 */
function demonstrateCreditCard(): void {
    console.log("\n💳 === DEMONSTRANDO CARTÃO DE CRÉDITO ===");
    
    const creditCard = new CreditCard();
    
    // Processar pagamento
    creditCard.pay(150.00, "Compra online - E-commerce");
    
    // Gerar comprovante (implementa IGenerateDocument)
    creditCard.generateDocument(150.00, "Compra online - E-commerce");
    
    console.log("✅ Cartão de crédito: Implementa IPaymentMethod + IGenerateDocument");
    console.log("❌ Cartão de crédito: NÃO implementa IGenerateQrCode (não precisa)");
}

/**
 * Função que demonstra pagamento com boleto
 */
function demonstrateBoleto(): void {
    console.log("\n🧾 === DEMONSTRANDO BOLETO ===");
    
    const boleto = new Boleto();
    
    // Processar pagamento
    boleto.pay(200.00, "Pagamento de conta - Serviços");
    
    // Gerar boleto (implementa IGenerateDocument)
    boleto.generateDocument(200.00, "Pagamento de conta - Serviços");
    
    console.log("✅ Boleto: Implementa IPaymentMethod + IGenerateDocument");
    console.log("❌ Boleto: NÃO implementa IGenerateQrCode (não precisa)");
}

/**
 * Função que demonstra pagamento com PIX
 */
function demonstratePix(): void {
    console.log("\n📱 === DEMONSTRANDO PIX ===");
    
    const pix = new Pix();
    
    // Processar pagamento
    pix.pay(75.50, "Transferência PIX - Amigo");
    
    // Gerar QR Code (implementa IGenerateQrCode)
    pix.generateQrCode(75.50, "Transferência PIX - Amigo");
    
    console.log("✅ PIX: Implementa IPaymentMethod + IGenerateQrCode");
    console.log("❌ PIX: NÃO implementa IGenerateDocument (não precisa)");
}

/**
 * Função que demonstra o problema de violar o ISP
 */
function demonstrateViolation(): void {
    console.log("\n⚠️ === DEMONSTRANDO VIOLAÇÃO DO ISP ===");
    
    console.log("❌ PROBLEMA: Interface monolítica");
    console.log(`
interface IPaymentMethod {
    pay(): void;
    generateDocument(): void;  // Cartão e Boleto precisam
    generateQrCode(): void;    // Apenas PIX precisa
}
    `);
    
    console.log("✅ SOLUÇÃO: Interfaces segregadas");
    console.log(`
interface IPaymentMethod {
    pay(): void;
}

interface IGenerateDocument {
    generateDocument(): void;
}

interface IGenerateQrCode {
    generateQrCode(): void;
}
    `);
    
    console.log("💡 Benefício: Cada classe implementa apenas o que precisa!");
}

/**
 * Função que demonstra os benefícios do ISP
 */
function demonstrateBenefits(): void {
    console.log("\n🎯 === BENEFÍCIOS DO ISP ===");
    
    console.log("✅ 1. Flexibilidade:");
    console.log("   - Cartão de crédito não é forçado a gerar QR Code");
    console.log("   - PIX não é forçado a gerar documento tradicional");
    console.log("   - Boleto não é forçado a gerar QR Code");
    
    console.log("\n✅ 2. Manutenibilidade:");
    console.log("   - Mudanças em uma interface não afetam outras");
    console.log("   - Adicionar novos métodos não quebra implementações existentes");
    
    console.log("\n✅ 3. Testabilidade:");
    console.log("   - Testes mais específicos e focados");
    console.log("   - Mocks mais simples e precisos");
    
    console.log("\n✅ 4. Extensibilidade:");
    console.log("   - Novos métodos de pagamento podem implementar apenas o necessário");
    console.log("   - Novas funcionalidades podem ser adicionadas sem afetar o existente");
}

/**
 * Função principal que executa todos os exemplos
 */
function main(): void {
    console.log("🎯 EXEMPLOS - Interface Segregation Principle (ISP)");
    console.log("=" .repeat(60));
    
    // Executar exemplos
    demonstrateCreditCard();
    demonstrateBoleto();
    demonstratePix();
    demonstrateViolation();
    demonstrateBenefits();
    
    console.log("\n" + "=" .repeat(60));
    console.log("✅ Todos os exemplos executados com sucesso!");
    console.log("\n💡 Princípio demonstrado:");
    console.log("   - Muitas interfaces específicas são melhores que uma interface geral");
    console.log("   - Classes não devem ser forçadas a implementar métodos que não usam");
    console.log("   - Interfaces devem ser coesas e focadas em uma responsabilidade");
}

export {
    demonstrateCreditCard,
    demonstrateBoleto,
    demonstratePix,
    demonstrateViolation,
    demonstrateBenefits,
    main
};

// Executar a função principal quando o arquivo for executado
main(); 