# DynamoDB Table
resource "aws_dynamodb_table" "transactions" {
  name         = "transactions"
  billing_mode = "PAY_PER_REQUEST" # Evita a necessidade de definir throughput

  hash_key  = "id"
  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name               = "userId-index"
    hash_key          = "userId"
    projection_type   = "ALL"
  }
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.transactions.name
}