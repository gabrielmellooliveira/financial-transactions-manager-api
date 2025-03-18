import { TransactionEntity } from "../../entities/transaction-entity";

type Configs = {
  limit?: number;
  lastEvaluatedKey?: any;
}

export interface TransactionRepositoryInterface {
  createTransaction: (entity: TransactionEntity) => Promise<void>
  findByUserId: (userId: string, configs: Configs) => Promise<TransactionEntity[]>
  findByUserIdAndMonth: (userId: string, month: string) => Promise<TransactionEntity[]>
}