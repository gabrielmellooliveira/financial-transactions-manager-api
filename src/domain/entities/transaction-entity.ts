export class TransactionEntity {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
  description: string;

  constructor(
    id: string,
    userId: string, 
    amount: number, 
    createdAt: string,
    description: string
  ) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.createdAt = createdAt;
    this.description = description;
  }
}