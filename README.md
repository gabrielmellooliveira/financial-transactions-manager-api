# Financial Transactions Manager API

API de gerenciamento de transações financeiras.

## Rodando o projeto

### Configuração do DynamoDB

Para configurar o DynamoDB no seu projeto, altere as variaveis e credencias no código do arquivo ```src/infra/database/dynamodb.ts```.

### Instalando as dependencias

Após baixar o projeto na sua máquina, rode o seguinte comando para instalar as dependencias do mesmo:

```
yarn
```

### Rodando o ambiente localmente

#### Docker Compose

Para criar a instância do ```DynamoDB``` localmente com Docker Compose, deve ser utilizado o seguinte comando:

```
docker-compose up -d
```

#### Serverless

Para criar uma instância serverless localmente, primeiro é necessário realizar o setup do framework serverless, que pode ser seguido com base nesse tutorial https://www.serverless.com/framework/docs/getting-started.

Basicamente, você precisa rodar o seguinte comando para instalar o serverless:

```
npm i serverless -g
```

### Realizando o deploy

#### AWS

Primeiro é necessário configurar a AWS em seu ambiente, então rode o comando:

```
aws configure
```

#### Convertendo o projeto

Para converter o projeto Typescript em Javascript, rode o comando:

```
tsc --outDir dist
```

#### Zipando o projeto

Deve realizar o ZIP do projeto com:

```
zip -r financial-transactions-manager-api.zip dist node_modules package.json
```

ou rodando o comando:

```
serverless package
```

#### Enviando o arquivo para S3

Deve rodar esse comando para adicionar o arquivo ZIP no s3, apontando para a pasta em que o ZIP está:

```
aws s3 cp financial-transactions-manager-api.zip s3://gabrielmello-teste1/financial-transactions-manager-api.zip
```

#### Terraform

Para utilizar o terraform, primeiro é necessário realizar o setup do terraform, que pode ser seguido com base nesse tutorial https://developer.hashicorp.com/terraform/install.

Para realizar o deploy na AWS, utilize o comando:

```
terraform apply
```

## Postman

Você pode baixar o arquivo chamado financial-transactions-manager-api.postman_collection.json que está no projeto e importa-lo na aplicação do postman para rodar os endpoints.