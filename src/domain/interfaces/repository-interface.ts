type Configs = {
  limit?: number;
  lastEvaluatedKey?: any;
}

interface RepositoryInterface {
  create: (entity: any) => Promise<void>
  findBy: (key: string, value: string, configs: Configs) => Promise<any>
}