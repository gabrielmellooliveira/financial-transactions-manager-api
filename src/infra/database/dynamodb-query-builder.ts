export default class DynamoDBQueryBuilder {
  static buildQuery(tableName: string, params: QueryParams) {
    let expressionAttributeValues: { [key: string]: any } = {};
    let keyConditionExpression = '';
    let filterExpression = '';
    
    const { 
      keyConditionExpressionResult, 
      expressionAttributeValuesKey 
    } = DynamoDBQueryBuilder.getKeysFilters(
      params.filters, 
      keyConditionExpression, 
      expressionAttributeValues
    );

    const { 
      filterExpressionResult, 
      expressionAttributeValuesFilter 
    } = DynamoDBQueryBuilder.getNonKeyFilters(
      params.filters, 
      filterExpression, 
      expressionAttributeValuesKey
    );

    const expressionValues = { ...expressionAttributeValuesFilter };

    const queryParams: any = {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpressionResult,
      ExpressionAttributeValues: expressionValues,
    };

    if (filterExpressionResult) {
      queryParams.FilterExpression = filterExpressionResult;
    }

    if (params.limit) {
      queryParams.Limit = params.limit;
    }

    if (params.lastEvaluatedKey) {
      queryParams.ExclusiveStartKey = params.lastEvaluatedKey;
    }

    if (params.useGSI && params.indexName) {
      queryParams.IndexName = params.indexName;
    }

    console.log('queryParams', queryParams);

    return queryParams;
  }

  static getKeysFilters(filters: Filter[], keyConditionExpression: string, expressionAttributeValues: { [key: string]: any }): any {
    const keyFilters = filters.filter(filter => filter.operator === '=');
    
    if (keyFilters.length > 0) {
      keyConditionExpression = keyFilters
        .map((filter, index) => `${filter.field} = :${filter.field}`)
        .join(' AND ');

      keyFilters.forEach((filter, index) => {
        expressionAttributeValues[`:${filter.field}`] = { S: filter.value };
      });
    }

    return {
      keyConditionExpressionResult: keyConditionExpression,
      expressionAttributeValuesKey: expressionAttributeValues
    };
  }

  static getNonKeyFilters(filters: Filter[], filterExpression: string, expressionAttributeValues: { [key: string]: any }): any {
    const nonKeyFilters = filters.filter(filter => filter.operator !== '=');

    if (nonKeyFilters.length > 0) {
      filterExpression = nonKeyFilters
        .map((filter, index) => { 
          if (filter.operator === 'begins_with') {
            return `begins_with(${filter.field}, :${filter.field})`
          }
          
          return `${filter.field} ${filter.operator} :${filter.field}`
        })
        .join(' AND ');

      nonKeyFilters.forEach((filter, index) => {
        expressionAttributeValues[`:${filter.field}`] = { S: filter.value };
      });
    }

    return {
      filterExpressionResult: filterExpression,
      expressionAttributeValuesFilter: expressionAttributeValues
    };
  }
}