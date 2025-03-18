interface DatabaseInterface {
  autoMigrate: (tableName: string) => Promise<void>
  insert: (tableName: string, data: any) => Promise<void>
  findBy: (tableName: string, queryParams: QueryParams) => Promise<any>
}

interface Filter {
  field: string;
  operator: string;
  value: any;
}

interface QueryParams {
  filters: Filter[];
  useGSI?: boolean;
  indexName?: string;
  limit?: number;
  lastEvaluatedKey?: any;
}