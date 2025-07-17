// incorrect way
export class BankAccount {
  protected balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser maior que 0");
    if (amount > this.balance) throw new Error("Saldo insuficiente");
    this.balance -= amount;
    console.log(`✅ Saque: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

export class CheckingAccount extends BankAccount {
  private overdraftLimit: number = 1000;

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser maior que 0");
    const available = this.balance + this.overdraftLimit;
    if (amount > available) throw new Error("Limite excedido");
    this.balance -= amount; // ❌ Permite saldo negativo!
    console.log(`❌ Saque: R$ ${amount}, Saldo: R$ ${this.balance} (negativo!)`);
  }
}


//correct away

export interface NoOverdraftAccount {
  deposit(amount: number): void; // Aceita valores > 0
  withdraw(amount: number): void; // Não permite saldo negativo
  getBalance(): number;
}

export interface OverdraftAccount {
  deposit(amount: number): void; // Aceita valores > 0
  withdraw(amount: number): void; // Permite saldo negativo até o limite
  getBalance(): number;
  getOverdraftLimit(): number;
}

export class StandardBankAccount implements NoOverdraftAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser maior que 0");
    if (amount > this.balance) throw new Error("Saldo insuficiente");
    this.balance -= amount;
    console.log(`✅ Saque: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  getBalance(): number {
    return this.balance;
  }
}

export class OverdraftBankAccount implements OverdraftAccount {
  private balance: number = 0;
  private overdraftLimit: number = 1000;

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser positivo");
    this.balance += amount;
    console.log(`✅ Depósito: R$ ${amount}, Saldo: R$ ${this.balance}`);
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Valor deve ser maior que 0");
    const available = this.balance + this.overdraftLimit;
    if (amount > available) throw new Error("Limite excedido");
    this.balance -= amount;
    if (this.balance < 0) {
      console.log(`💳 Cheque especial usado: R$ ${-this.balance}`);
    } else {
      console.log(`✅ Saque: R$ ${amount}, Saldo: R$ ${this.balance}`);
    }
  }

  getBalance(): number {
    return this.balance;
  }

  getOverdraftLimit(): number {
    return this.overdraftLimit;
  }
}