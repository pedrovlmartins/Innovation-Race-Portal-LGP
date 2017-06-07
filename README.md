# Innovation Race Portal

Plataforma para gerir a iniciativa "Innovation Race Portal", promovida pela Altran.

## Fase de Desenvolvimento

### Configurar

Para se configurar o ambiente de desenvolvimento, deve começar-se por obter o código-fonte do produto (preferencialmente, clonando este repositório para um diretório local).

Depois, no diretório em que se encontra o ficheiro /src/package.json, deve ser corrido o comando `npm install`. Este comando instalará todas as dependências do produto (tanto as necessárias ao funcionamento do produto, como ao seu desenvolvimento).

Deve também ser configurado um servidor MySQL como DBMS (Database Management System). Depois de configurado e criado um schema MySQL, o script que se encontra em /scripts/database/db.sql deve ser executado nesse mesmo schema. O script referido irá criar as tabelas necessárias, bem como popular as mesmas com dados de teste.

É importante salientar que o ficheiro /src/config.js deve ser atualizado com a informação do caminho e credenciais do servidor MySQL, bem como o nome e schema (database) a utilizar.

### Executar

Inicialmente, é conveniente definir a variável de ambiente NODE_ENV com o valor 'development', 'production' ou 'test' consoante o produto esteja a ser executado em ambiente de desenvolvimento, produção ou teste, respetivamente. Se a variável não estiver definida, é assumido um ambiente de desenvolvimento.

Para além disso, pode ser pertinente alterar o porto a partir do qual o servidor está a escutar os pedidos HTTP. O valor atualmente definido é 8080 e pode ser alterado na variável PORT no ficheiro /src/app.js.

Posto isto, para executar o projeto, basta correr o comando `npm start`.


