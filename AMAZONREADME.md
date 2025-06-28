# Passo a Passo: Infraestrutura AWS

  

## 1. Criar uma VPC

- Acesse o console AWS.

- Vá em **VPC > Your VPCs > Create VPC**.

- Defina nome (especificar no nome se eh publica ou privada), bloco CIDR  

## 2. Criar Subredes

- Vá em **Subnets > Create subnet**.

- Crie pelo menos uma subrede pública (172.31.1.0/24).

- Crie pelo menos uma subrede privada (172.31.2.0/24).

## 3. Criar e Associar um Internet Gateway

- Vá em **Internet Gateways > Create internet gateway** (igw-flask).

- Anexe o gateway à sua VPC.

## 4. Criar Tabelas de Roteamento

- Vá em **Route Tables > Create route table**.

- Associe a subrede pública à tabela de rotas pública.

- Adicione rota `0.0.0.0/0` apontando para o Internet Gateway.

- Associe a subrede privada à tabela de rotas privada (sem rota para o IGW).

## 5. Criar uma Instância EC2

- Vá em **EC2 > Instances > Launch Instance**.

- Escolha AMI, tipo, e selecione a subrede pública.

- Configure grupo de segurança para permitir Todas as conexões.

## 6. Criar um RDS

- Vá em **RDS > Databases > Create database**.

- PostGresSQL **SELECIONANDO O FREE TIER**!!!!!.

- Selecione a VPC criada e a subrede **pública** (pra facilitar nossa vida).

- Credenciais: Estão no app.py

- Associe a EC2 ao RDS (opção na criação).

  

## 7. Testar Conectividade

- Conecte na EC2 via HTTP.

- Driver do PostGres:

- `sudo dnf install postgresql15 postgresql15-server -y`

- Git:

- `sudo dnf install git`

- testar conexão com PostGres: `psql -h <ENDPOINT_RDS> -U admin -W`



## 8. Deletar o RDS

- Vá em **RDS > Databases**.
- Selecione o banco de dados criado.
- Clique em **Actions > Delete**.
- Confirme a exclusão e aguarde a remoção completa.

## 9. Deletar a Instância EC2

- Vá em **EC2 > Instances**.
- Selecione a instância criada.
- Clique em **Instance State > Terminate Instance**.
- Confirme a ação e aguarde a finalização.

## 10. Desconectar o Internet Gateway

- Vá em **VPC > Internet Gateways**.
- Selecione o Internet Gateway anexado à VPC.
- Clique em **Actions > Detach from VPC**.
- Após desconectar, se desejar, exclua o Internet Gateway.