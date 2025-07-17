
//incorrect way
export class BankAccountPre {
  protected balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

export class SavingsAccount extends BankAccountPre {
  deposit(amount: number): void {
    if (amount < 10) throw new Error("Depósito mínimo é R$ 10"); // ❌ Restrição extra!
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }
}

// correct way
export interface Depositable {
  deposit(amount: number): void; // Aceita qualquer valor > 0
  getBalance(): number;
}

export interface MinimumDepositAccount {
  deposit(amount: number): void; // Exige depósito mínimo
  getBalance(): number;
  getMinimumDeposit(): number;
}

export class SafeBasicAccount implements Depositable {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

export class SafeSavingsAccount implements MinimumDepositAccount {
  private balance: number = 0;
  private minimumDeposit: number = 10;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    if (amount < this.minimumDeposit) throw new Error("Depósito mínimo é R$ 10");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }

  getMinimumDeposit(): number {
    return this.minimumDeposit;
  }
}