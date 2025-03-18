export class FindTransactionsByUserInput {
  userId: string;
  limit: number;
  lastEvaluatedKey: any;

  constructor(userId: string, limit: number, lastEvaluatedKey: any) {
    this.userId = userId;
    this.limit = limit;
    this.lastEvaluatedKey = lastEvaluatedKey;
  }

  static validate(input: FindTransactionsByUserInput): void {
    if (!input.userId || input.userId.trim() === '') {
      throw new Error("UserId field is required and cannot be empty");
    }
  }
}