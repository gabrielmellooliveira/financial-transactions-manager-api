# Criando a função Lambda
resource "aws_lambda_function" "get_balance_by_user_lambda" {
  function_name = "get_balance_by_user_lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "dist/main.findAmountByMonth"
  runtime       = "nodejs18.x"

  s3_bucket     = "gabrielmello-teste1"
  s3_key        = "financial-transactions-manager-api.zip"
  source_code_hash = filebase64sha256("financial-transactions-manager-api.zip")  # Para referência de controle de versões

  # filename = "financial-transactions-manager-api.zip" # O código da Lambda deve ser compactado em um ZIP

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.transactions.name
    }
  }
}

# Criando o recurso "/users/{userId}/balance"
resource "aws_api_gateway_resource" "get_balance_by_user_resource" {
  rest_api_id = aws_api_gateway_rest_api.transactions_api.id
  parent_id   = aws_api_gateway_rest_api.transactions_api.root_resource_id
  path_part   = "balance"
}

# Criando o método GET /users/{userId}/balance
resource "aws_api_gateway_method" "get_balance_by_user_method" {
  rest_api_id   = aws_api_gateway_rest_api.transactions_api.id
  resource_id   = aws_api_gateway_resource.get_balance_by_user_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

# Integração do GET /users/{userId}/balance com a Lambda
resource "aws_api_gateway_integration" "get_balance_by_user_integration" {
  rest_api_id             = aws_api_gateway_rest_api.transactions_api.id
  resource_id             = aws_api_gateway_resource.get_balance_by_user_resource.id
  http_method             = aws_api_gateway_method.get_balance_by_user_method.http_method
  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.get_balance_by_user_lambda.invoke_arn
}

# Permitir que API Gateway invoque a Lambda
resource "aws_lambda_permission" "get_balance_by_user_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_balance_by_user_lambda.function_name
  principal     = "apigateway.amazonaws.com"
}

output "get_balance_by_user_lambda_name" {
  value = aws_lambda_function.get_balance_by_user_lambda.function_name
}