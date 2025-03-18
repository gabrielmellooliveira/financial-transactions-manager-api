# Criando a função Lambda (FEITO)
resource "aws_lambda_function" "create_transaction_lambda" {
  function_name = "create_transaction_lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "dist/main.createTransaction"
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

# Criando o recurso "/transactions" para POST
resource "aws_api_gateway_resource" "create_transaction_resource" {
  rest_api_id = aws_api_gateway_rest_api.transactions_api.id
  parent_id   = aws_api_gateway_rest_api.transactions_api.root_resource_id
  path_part   = "transactions"
}

# Criando o método POST /transactions
resource "aws_api_gateway_method" "create_transaction_method" {
  rest_api_id   = aws_api_gateway_rest_api.transactions_api.id
  resource_id   = aws_api_gateway_resource.create_transaction_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# Integração do POST com Lambda
resource "aws_api_gateway_integration" "create_transaction_integration" {
  rest_api_id             = aws_api_gateway_rest_api.transactions_api.id
  resource_id             = aws_api_gateway_resource.create_transaction_resource.id
  http_method             = aws_api_gateway_method.create_transaction_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.create_transaction_lambda.invoke_arn
}

# Permitir que API Gateway invoque a Lambda
resource "aws_lambda_permission" "create_transaction_lambda_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_transaction_lambda.function_name
  principal     = "apigateway.amazonaws.com"
}

output "create_transaction_lambda_name" {
  value = aws_lambda_function.create_transaction_lambda.function_name
}