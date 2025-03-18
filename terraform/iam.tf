# Criando a Role para a Lambda
resource "aws_iam_role" "lambda_role" {
  name = "lambda_dynamodb_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach permissões do DynamoDB à Role da Lambda
resource "aws_iam_policy_attachment" "lambda_dynamodb_policy" {
  name       = "lambda_dynamodb_attachment"
  roles      = [aws_iam_role.lambda_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}