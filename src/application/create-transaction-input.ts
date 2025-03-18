export class CreateTransactionInput {
  userId: string;
  amount: number;
  description: string;

  constructor(userId: string, amount: number, description: string) {
    this.userId = userId;
    this.amount = amount;
    this.description = description;
  }

  static validate(input: CreateTransactionInput): void {
    if (input.amount === 0) {
      throw new Error("Amount field cannot be zero");
    }
  
    if (!input.description || input.description.trim() === '') {
      throw new Error("Description field is required and cannot be empty");
    }
  }
}