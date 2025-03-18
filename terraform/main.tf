terraform {
  required_version = "1.11.2"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.91.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" # Defina a região desejada
  profile = "default"
}

# Criar o deployment da API Gateway
resource "aws_api_gateway_deployment" "transactions_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.transactions_api.id

  depends_on = [
    aws_api_gateway_integration.create_transaction_integration,
    aws_api_gateway_integration.get_transactions_by_user_integration,
    aws_api_gateway_integration.get_balance_by_user_integration
  ]
}