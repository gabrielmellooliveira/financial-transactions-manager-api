import { TransactionEntity } from "../entities/transaction-entity";
import { TransactionRepositoryInterface } from "../interfaces/repositories/transaction-repository-interface";

export default class TransactionRepository implements TransactionRepositoryInterface {
  private TABLE_NAME = 'transactions'
  
  constructor(
    readonly database: DatabaseInterface,
  ) {}

  async createTransaction(entity: TransactionEntity): Promise<void> {
    try {
      await this.database.autoMigrate(this.TABLE_NAME);
      await this.database.insert(this.TABLE_NAME, entity);
    } catch (error: any) {
      throw new Error('Error on create a transaction - ' + error.message);
    }
  }

  async findByUserId(userId: string, configs: Configs): Promise<TransactionEntity[]> {
    try {
      await this.database.autoMigrate(this.TABLE_NAME);

      const queryParams: QueryParams = {
        filters: [
          { field: 'userId', operator: '=', value: userId },
        ],
        useGSI: true,
        indexName: 'userId-index',
        limit: configs.limit,
        lastEvaluatedKey: configs.lastEvaluatedKey,
      };

      const result = await this.database.findBy(this.TABLE_NAME, queryParams);

      return result.map((item: any) => {
        return new TransactionEntity(
          item.id, 
          item.userId, 
          item.amount, 
          item.createdAt, 
          item.description
        );
      });
    } catch (error: any) {
      throw new Error('Error on find transactions by userId - ' + error.message);
    }
  }

  async findByUserIdAndMonth(userId: string, month: string): Promise<TransactionEntity[]> {
    try {
      await this.database.autoMigrate(this.TABLE_NAME);

      const queryParams: QueryParams = {
        filters: [
          { field: 'userId', operator: '=', value: userId },
          { field: 'createdAt', operator: 'begins_with', value: month },
        ],
        useGSI: true,
        indexName: 'userId-index',
      };

      const result = await this.database.findBy(this.TABLE_NAME, queryParams);

      return result.map((item: any) => {
        return new TransactionEntity(
          item.id, 
          item.userId, 
          item.amount, 
          item.createdAt, 
          item.description
        );
      });
    } catch (error: any) {
      throw new Error('Error on find transactions by userId and month - ' + error.message);
    }
  }
}