import dotenv from 'dotenv';

import { Handler, Context } from 'aws-lambda';
import CreateTransaction from './src/application/create-transaction';
import FindTransactionsByUser from './src/application/find-transactions-by-user';
import FindAmountByMonth from './src/application/find-amount-by-month';
import DynamoDb from './src/infra/database/dynamodb';
import TransactionRepository from './src/domain/repositories/transaction-repository';
import { Hasher } from './src/infra/security/hasher';
import { CreateTransactionInput } from './src/application/create-transaction-input';
import { FindTransactionsByUserInput } from './src/application/find-transactions-by-user-input';
import { FindAmountByMonthInput } from './src/application/find-amount-by-month-input';

// Database
const database = new DynamoDb();

// Repositories
const transactionRepository = new TransactionRepository(database);

// Hasher
const hasher = new Hasher();

export const createTransaction: Handler = async (event: any, context: Context) => {
  try {
    const input: CreateTransactionInput = JSON.parse(event.body);
    CreateTransactionInput.validate(input);

    const usecase = new CreateTransaction(transactionRepository, hasher);

    const result = await usecase.execute(input);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export const findTransactionsByUser: Handler = async (event: any, context: Context) => {
  try {
    const userId = event.pathParameters?.userId;
    const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit) : 10;
    const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey ? JSON.parse(event.queryStringParameters.lastEvaluatedKey) : undefined;

    const input = new FindTransactionsByUserInput(userId, limit, lastEvaluatedKey);
    
    FindTransactionsByUserInput.validate(input);

    const usecase = new FindTransactionsByUser(transactionRepository);

    const result = await usecase.execute(input);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export const findAmountByMonth: Handler = async (event: any, context: Context) => {
  try {
    const userId = event.pathParameters?.userId;
    const month = event.queryStringParameters?.month ? event.queryStringParameters.month : "";

    const input = new FindAmountByMonthInput(userId, month);
    
    FindAmountByMonthInput.validate(input);

    const usecase = new FindAmountByMonth(transactionRepository);

    const result = await usecase.execute(input);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};