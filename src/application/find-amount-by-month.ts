import { TransactionEntity } from "../domain/entities/transaction-entity";
import { TransactionRepositoryInterface } from "../domain/interfaces/repositories/transaction-repository-interface";
import { FindAmountByMonthInput } from "./find-amount-by-month-input";

export default class FindAmountByMonth implements UseCaseInterface {
  constructor(
    readonly transactionRepository: TransactionRepositoryInterface
  ) {}

  async execute(input: FindAmountByMonthInput): Promise<any> {
    const transactions = await this.transactionRepository.findByUserIdAndMonth(input.userId, input.month);

    const balance = transactions.reduce((acc: number, transaction: TransactionEntity) => {
      return acc + transaction.amount;
    }, 0);

    return {
      balance,
      month: input.month,
    }
  }
}