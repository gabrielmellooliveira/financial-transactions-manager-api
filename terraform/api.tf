# Criando o API Gateway
resource "aws_api_gateway_rest_api" "transactions_api" {
  name        = "transactions-api"
  description = "API para gerenciar transações"
}

output "api_gateway_url" {
  value = aws_api_gateway_deployment.transactions_api_deployment.invoke_url
}