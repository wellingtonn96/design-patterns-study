// src/models/order.ts
export class Order {
  constructor(
    public id: string,
    public amount: number,
    private _status: string = "pending"
  ) {
    if (amount < 0) throw new Error("Valor inválido");
    if (!id) throw new Error("ID obrigatório");
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }
}
