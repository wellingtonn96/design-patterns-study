import { BankAccount, CheckingAccount, OverdraftAccount, OverdraftBankAccount } from "./src/invariance";
import { CloudFileSaver, ICloudFileSaver, IFileSaver, ILocalFileSaver, LocalFileSaver, SafeCloudFileSaver, SafeLocalFileSaver } from "./src/post-condition";
import { BankAccountPre, MinimumDepositAccount, SafeSavingsAccount, SavingsAccount } from "./src/pre-condition";

// Teste Invariância
console.log("\n❌ Teste Invariância (Incorreto)");
try {
  const badAccount: BankAccount = new CheckingAccount();
  badAccount.deposit(500);
  badAccount.withdraw(1500); // ❌ Permite saldo negativo!
} catch (e: any) {
  console.log(`Erro: ${e.message}`);
}

console.log("\n✅ Teste Invariância (Correto)");
try {
  const goodAccount: OverdraftAccount = new OverdraftBankAccount();
  goodAccount.deposit(500);
  goodAccount.withdraw(1500); // ✅ Usa cheque especial
} catch (e: any) {
  console.log(`Erro: ${e.message}`);
}

// Teste Pré-condição
console.log("\n❌ Teste Pré-condição (Incorreto)");
try {
  const badSavings: BankAccountPre = new SavingsAccount();
  badSavings.deposit(5); // ❌ Lança erro por depósito mínimo
} catch (e: any) {
  console.log(`Erro: ${e.message}`);
}

console.log("\n✅ Teste Pré-condição (Correto)");
try {
  const goodSavings: MinimumDepositAccount = new SafeSavingsAccount();
  goodSavings.deposit(5); // ❌ Lança erro, mas contrato é claro
} catch (e: any) {
  console.log(`Erro: ${e.message}`);
}

// Teste Pós-condição
console.log("\n❌ Teste Pós-condição (Incorreto)");
function testFileSaver(saver: IFileSaver) {
  const path = saver.saveFile("conteúdo");
  if (path.startsWith("/")) {
    console.log(`✅ Arquivo local: ${path}`);
  } else {
    console.log(`❌ Esperava caminho local, recebeu: ${path}`);
  }
}
testFileSaver(new LocalFileSaver());
testFileSaver(new CloudFileSaver());

console.log("\n✅ Teste Pós-condição (Correto)");
function testLocalFileSaver(saver: ILocalFileSaver) {
  const path = saver.saveFileLocal("conteúdo");
  console.log(`✅ Arquivo local: ${path}`);
}
function testCloudFileSaver(saver: ICloudFileSaver) {
  const url = saver.saveFileCloud("conteúdo");
  console.log(`✅ Arquivo na nuvem: ${url}`);
}
testLocalFileSaver(new SafeLocalFileSaver());
testCloudFileSaver(new SafeCloudFileSaver());