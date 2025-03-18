import { TransactionRepositoryInterface } from "../domain/interfaces/repositories/transaction-repository-interface";
import { FindTransactionsByUserInput } from "./find-transactions-by-user-input";

export default class FindTransactionsByUser implements UseCaseInterface {
  constructor(
    readonly transactionRepository: TransactionRepositoryInterface
  ) {}

  async execute(input: FindTransactionsByUserInput): Promise<any> {
    return await this.transactionRepository.findByUserId(input.userId, {
      limit: input.limit,
      lastEvaluatedKey: input.lastEvaluatedKey
    });
  }
}