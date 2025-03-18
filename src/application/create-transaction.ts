import { TransactionEntity } from "../domain/entities/transaction-entity";
import { TransactionRepositoryInterface } from "../domain/interfaces/repositories/transaction-repository-interface";
import { CreateTransactionInput } from "./create-transaction-input";

export default class CreateTransaction implements UseCaseInterface {
  constructor(
    readonly transactionRepository: TransactionRepositoryInterface,
    readonly hasher: HasherInterface,
  ) {}

  async execute(input: CreateTransactionInput): Promise<any> {
    const transaction = new TransactionEntity(
      this.hasher.generateUuid(),
      input.userId,
      input.amount,
      new Date().toISOString(),
      input.description
    );

    await this.transactionRepository.createTransaction(transaction);

    return {
      transaction: transaction.id,
      message: 'Transaction created successfully',
    };
  }
}