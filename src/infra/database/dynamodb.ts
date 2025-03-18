import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeDefinition, AttributeValue, CreateTableCommand, DescribeTableCommand, DynamoDBClient, GlobalSecondaryIndex, KeySchemaElement, KeyType, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import DynamoDBQueryBuilder from "./dynamodb-query-builder";

export default class DynamoDb implements DatabaseInterface {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;
  
  constructor() {
    this.client = this.getConnectClient();
    this.docClient = this.getConnectDocumentClient();
  }

  getConnectClient(): DynamoDBClient {
    return new DynamoDBClient({ 
      region: "us-east-1", 
      endpoint: "https://dynamodb.us-east-1.amazonaws.com", 
      credentials: {
        accessKeyId: "ACCESS_KEY_ID",
        secretAccessKey: "SECRET_ACCESS_KEY",
      }, 
    });
  }

  getConnectDocumentClient(): DynamoDBDocumentClient {
    return DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        removeUndefinedValues: true, 
        convertClassInstanceToMap: true, 
      },
      unmarshallOptions: {
        wrapNumbers: false, 
      },
    });
  }

  async autoMigrate(tableName: string): Promise<void> {
    await this.createTableIfNotExists(tableName);
  }

  async insert(tableName: string, data: any): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: data,
      });

      await this.docClient.send(command);
    } catch (error) {
      console.error(error);
    }
  }

  async findBy(tableName: string, params: any): Promise<any> {
    try {
      const queryParams = DynamoDBQueryBuilder.buildQuery(tableName, params);
      const command = new QueryCommand(queryParams);

      const result = await this.client.send(command);

      if (!result.Items || result.Items.length === 0) {
        return [];
      }

      return result.Items.map(item => {
        return unmarshall(item);
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async createTableIfNotExists(tableName: string): Promise<void> {
    try {
      const params = {
        TableName: tableName,
        KeySchema: [
          { AttributeName: "id", KeyType: KeyType.HASH },
        ],
        AttributeDefinitions: [
          { AttributeName: "id", AttributeType: "S" } as AttributeDefinition, 
          { AttributeName: "userId", AttributeType: "S" } as AttributeDefinition,
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "userId-index",
            KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
            Projection: { ProjectionType: "ALL" },
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
          },
        ] as GlobalSecondaryIndex[],
        ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
      };

      if (await this.tableExists(tableName)) {
        return;
      }
    
      await this.client.send(new CreateTableCommand(params));
    } catch (error: any) {
      console.error("❌ Error creating table:", error.message);
    }
  }

  private async tableExists(tableName: string): Promise<boolean> {
    try {
      await this.client.send(new DescribeTableCommand({ 
        TableName: tableName 
      }));

      return true;
    } catch (error: any) {
      if (error.name === "ResourceNotFoundException") {
        return false;
      }

      throw error;
    }
  };
}
