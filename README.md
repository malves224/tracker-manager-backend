# Requisitos rotas backend
 Rotas para o backend, que envolve questões relacionados ao funcionamento da aplicação como itens de menu, paginas, rotas, e controle de usuários do sistema.
## 1º Requisito rota `POST`  '/Login'
O endpoint login recebe o usuário e senha caso o usuário existe e a senha esteja correta o endpoint deverá retornara o TOKEN gerado pelo JWT, Corpo da response esperado:

~~~json
{
 "login": "fulano@email.com",
 "password": "123456789"
}
~~~

Verificações necessárias:

 - Caso alguns dos campos seja passado vazio ou não exista devará retornar status 400 esse formato no corpo da response: 
	```json
	{ "message": "'Campo' obrigatório" }
	```
-  Caso o usuário não exista deverá retornar status 401 com esse formato no corpo da response:
	```json
	{ "message":"Usuario não cadastrado." }
	```
- Caso a senha esteja invalida retorne o status 401 com esse formato no corpo da response: 
	```json
	{ "message": "Senha invalida." }
	```
- Caso de esteja tudo certo com as validações retorne o status 200 com o token valido no corpo da response:
	```json
	{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" } // Token valido JWT
	```
 
 ## 2º Requisito rota `GET`  /MenuItems
 O endpoint deve receber o Token do usuário nos headers como autenticação, caso esteja tudo certo com o token deverá retornar somente os Items do menu de navegação que o usuário tem permissão de acesso de acordo com seu perfil de acesso.

Verificações necessárias:

 - Caso o token não seja passado no headers:
	Retorne o status 401, com esse formato no corpo da requisição:
	```json
	{ "message": "Token nao encontrado" }
	```
- Caso o token esteja invalido ou expirado retorna, Retorne o status 401, com esse formato no corpo da requisição:
	```json
	{ "message": "Token invalido ou expirado" }
	```
- Caso esteja tudo certo, retorne a lista de items do menu no seguinte formato no corpo da response:
	
~~~json
[
  {
    "name": "Pagina inicial",
    "pages": [
       { 
         "name": "Pagina inicial",
         "route": "home" 
       }
    ]
  },
  {
    "name": "Clientes",
    "pages": [
      {
        "name": "Novo cliente",
        "route": "NewClient"
      },
      {
        "name": "Clientes",
        "route": "ListClients"
      }
    ]
  }
]
 
~~~

## 3º Requisito rota `GET` /UserPages.

O endpoint deverá retornar todas paginas que o usuário autenticado tem permissão de acesso.

Verificações necessárias:

 - Caso o token não seja passado nos headers:
	Retorne o status 401, com esse formato no corpo da requisição:
	```json
	{ "message": "Token nao encontrado" }
	```
- Caso o token esteja invalido ou expirado retorna, Retorne o status 401, com esse formato no corpo da requisição:
	```json
	{ "message": "Token invalido ou expirado" }
	```
- Caso esteja tudo certo retorne o status 200 e a lista de pages relacionado ao perfil de acesso do usuário, Formato esperado no corpo da response: 
	```json
	[
	  { "name": "Novo cliente","route": "NewClient" },
	  { "name": "Novo veiculo", "NewVehicle" }
	]
	```
## 4º Requisito rota `GET` '/Pages'
O endpoint retorna todas as paginas do sistema e suas ações vinculado a uma entidade no banco de dados, essa rota é exclusiva para usuários que tem permissão de acesso a pagina usuários (UsersControl). 
 - Caso o token não seja passado nos headers:
	Retorne o status 401, com esse formato no corpo da response:
	```json
	{ "message": "Token nao encontrado" }
	```
- Caso o token esteja invalido ou expirado retorna, Retorne o status 401, com esse formato no corpo da response:
	```json
	{ "message": "Token invalido ou expirado" }
	```
- Caso o usuário não tenha permissão de acesso correta retorna o status 401, com esse formato no corpo da response:
	```json
	{"message": "Usuario não autorizado."}
	```
- Caso esteja tudo certo retorne o status 200, com esse formato no corpo da response: 
	```json
	[
	  {
		"id": 1,
		"name": "Listar clientes",
		"route": "ListClients",
		"actions": [ 
		  {
			"id": 1, 
			"entity": "clients",
			"get": true,
			"create": true,
			"edit": true,
			"delete": true
		  },
		]
	  }
	]
	```

## 5º Requisito rota `POST` '/Profile'
O endpoint cria um perfil de acesso ao sistema para ser vinculado ao um usuário, Em perfil de acesso é preciso vincular a o id da pagina que esse perfil terá acesso e as ações permitidas nessa pagina, O post deve ter o token do usuário nos headers e o formato esperado no corpo da requisição sera assim: 

~~~json
 {
   "name": "admin",
   "pages": [
    {
      "idPage": 1,
      "edit": true,
      "delete": true,
      "create": true
    },
    {
      "idPage": 2, // assim o usuario terá somente permissão de acesso.
      "edit": false,
      "delete": false,
      "create": false
    }
  ] 
 }
~~~
Obs: Para conceder apenas permissão de acesso, basta adicionar uma page á um perfil sem as chaves edit, delete, create ou com valores `false`.

Algumas verificações: 

-   Caso o token não seja passado nos headers, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado." }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```
- Caso esteja tudo certo deverá retornar o status 201, com esse formato no corpo da response:
	```json
	{
	  "id": 1,
	  "name": "admin",
	  "pages": [
		  {
        "idPage": 1,
        "edit": true,
        "delete": true,
        "create": true
		  },
		  {
        "idPage": 2,
        "edit": false,
        "delete": false,
        "create": false
		  }
    ] 
	}
	```
	Observação: Os campos edit, delete, create não são obrigatórios mas se for omitido a permissão das ações não sera concedida, ficando o perfil de acesso apenas com permissão de acesso.

## 6º Requisito rota `GET` '/Profiles'
O endpoint retorna todos o perfis do banco, é esperado o token do usuário nos headers.

Algumas verificações:
-   Caso o token não seja passado nos headers, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```
- Caso esteja tudo certo retorne todos perfis de acesso, Formato esperado da response: 
	```json
	[
	  {
      "id": 1,
      "name": "admin"
	  },
	  {
      "id": 2,
      "name": "cobrança"
	  }
	]
	```

## 7 º Requisito rota `PUT` `/Profile/:id`

O endpoint será capaz de editar/atualizar um perfil de acesso de acordo com o id que esta na rota, é necessário que o token do usuário esteja nos headers.
Formato do corpo da requisição.
~~~json
{
  "name": "admin",
  "pages": [
    {
      "idPage": 1,
      "edit": true,
      "delete": true,
      "create": true
    },
    {
      "idPage": 2,
      "edit": false,
      "delete": false,
      "create": false
    }
  ] 
}
~~~
Algumas verificações:
-   Caso o token não seja passado nos headers, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }  
    ```
    
-   Caso o token esteja invalido ou expirado retorna, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401 com esse formato no corpo da response:

    ```json
    { "message": "Usuario não autorizado." }
    ```
   
- Caso o id do perfil não exista retorna com o status 400 com esse formato de response:

    ```json
    { "message": "Perfil de acesso não existe." }
    ```

 - Caso algum campo obrigatório não seja passado no request, Retorna o status 400 com o corpo da response no seguinte formato:
	~~~json  
     { "message": "'campo' obrigatório!" }
	~~~
	

		Campos obrigatórios: "id" na rota, "name", "pages"

- Caso o formato da chave 'pages' seja invalida retorna status 400 com o corpo da response no seguinte formato: 
	~~~json
	{ "message": "A chave pages deve ser um array." }
	~~~
- Caso esteja tudo certo retorne o status 200, com o seguinte formato no corpo da response:

    ~~~json
    {
      "id": 1,
      "name": "admin",
      "pages": [
        {
          "idPage": 1,
          "edit": true,
          "delete": true,
          "create": true
        },
        {
          "idPage": 2,
          "edit": false,
          "delete": false,
          "create": false
        }
      ] 
    }
    ~~~

## 8 º Requisito rota `DELETE` '/Profile/:id'

O endpoint será capaz de excluir um um Perfil de acesso por meio do id que está no rota, é preciso passar o token do usuário nos headers.

	

Algumas verificações: 

-   Caso o token não seja passado nos headers:  
    Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```
    
  - Caso o perfil de acesso não existe retorna o status 400, com esse formato no corpo da response: 
  
	~~~json
	{ "message": "Perfil de acesso não existe." }
	~~~

- Caso o perfil de acesso tenha vinculo com algum usuário, retorna o status 403, com esse formato no corpo da response: 
	~~~json
	{ "message": "Perfil possui vincula com algum usuário, e não pode ser excluido." }
	~~~
 
- Caso der tudo certo retorna o status 204, sem retorno no corpo da response.

## 9 º Requisito rota `GET` '/Profile/:id'
O endpoint retorna um perfil de acesso de acordo com o id da rota, é preciso passar o token do usuario nos headers da requisição. 

-   Caso o token não seja passado nos headers:  
    Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso retorna o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```
    
- Caso o perfil de acesso não existe retorna o status 400, com esse formato no corpo da response: 

    ```json
    { "message": "Perfil de acesso não encontrado" }
    ```
    
- Caso esteja tudo certo, Retornar o status 200 com o usuário com id passado pela rota, exemplo: 

    ~~~json
    {
      "id": 1,
      "name": "admin",
      "pages": [
        {
          "idPage": 1,
          "edit": true,
          "delete": true,
          "create": true
        },
        {
          "idPage": 2,
          "edit": false,
          "delete": false,
          "create": false
        }
      ] 
    }
    ~~~

## 10 º Requisito rota `POST` '/User'
O endpoint será capaz de criar um novo usuário para o sistema, é preciso passar o token do usuário nos headers.
Formato esperado no corpo da requisição: 
```json
{
  "fullName": "MATHEUS ALVES DE OLIVEIRA",
  "occupation": "administrador",
  "email": "malves224@clewsat.com",
  "contact": "1195424244",
  "password": "123456789",
  "idPerfil": 1
}
```
Algumas verificações: 

-   Caso o token não seja passado nos headers, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```

- Todos campos do exemplo são obrigatório caso algum não seja passado ou esteja vazio, deve retornar o status 400, com o seguinte formato na response:
	
	```json
	{ "message": "'campo' obrigatorio." }
	```
	
- Os campos nome, email, contato e senha segue um formato valido, segue exemplos de formatos validos, caso algum campo esteja invalido deverá retornar uma mensagem no corpo da requisição ex: 
	~~~json
	{ "message": "'campo' com formato invalido" }
	~~~
	- email: "fulano@email.com".
	- password: senha igual ou maior a 8 digitos "12345678".
	- nome: nome completo "fulado da silva".
	- contato: 11943214567 ou 1122564588.

- Caso esteja tudo certo retorna os status 201, com o seguinte formato no corpo da response:

~~~json
{
  "id": 1,
  "nome": "MATHEUS ALVES DE OLIVEIRA",
  "cargo": "administrador",
  "email": "malves224@clewsat.com",
  "contato": "1195424244",
  "idPerfil": 1
}
~~~

- ATENÇÃO: A senha é preciso ser salva no banco de dados em formato de HASH, e não poderá ser retornado em nenhuma response.

## 11 º Requisito rota `PUT` `/User/:id`
O endpoint é capaz de editar/atualizar um usuário de acordo com o id que esta na rota, é necessário passar o token do usuário nos headers da requisição.
Exemplo de formato esperado no corpo da requisição.

~~~json
{
  "nome": "MATHEUS ALVES DE OLIVEIRA",
  "cargo": "administrador",
  "email": "malves224@clewsat.com",
  "contato": "1195424244",
  "password": "123456789",
  "idPerfil": 1
}
~~~

-   Caso o token não seja passado nos headers:  
    Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna, Retorne o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```

- Todos os campos são obrigatório exceto o 'password' casos de uso para o campo senha:
	- Caso a senha esteja null/undefined ou foi passada vazia, a senha não deverá ser trocada permanecendo a mesma.
	- Caso a senha seja passada troque a para a nova senha gerando um HASH no banco de dados.

- Os campos nome, email, contato e senha segue um formato valido, segue exemplos de formatos validos: 

	- email: "fulano@email.com" 
	- password: senha igual ou maior a 8 digitos "12345678",  se a senha não for passada na requisição ou esteja vazia não poderá ser validado.
	- nome: nome completo "fulado da silva"
	- contato: 11943214567 ou 1122564588

	Caso algum campo esteja invalido deverá retornar uma mensagem no corpo da requisição ex: 

~~~json
 { "message": "'campo' com formato invalido" }
~~~

- Caso esteja tudo certo, retorne o status 200, com o formato no corpo da response a seguir: 

~~~json
{
  "id": 1,
  "nome": "MATHEUS ALVES DE OLIVEIRA",
  "cargo": "administrador",
  "email": "malves224@clewsat.com",
  "contato": "1195424244",
  "idPerfil": 1
}
~~~

## 12 º Requisito rota `PUT` /User/me
	
O endpoint é capaz de editar/atualizar apenas o usuário que está autenticado, é preciso passar o token do usuários nos headers da requisição e a senha do usuário para efetivar a alteração.
Obs: não pode ser possível atualizar o perfil de acesso do mesmo.

```json
{
  "nome": "MATHEUS ALVES DE OLIVEIRA",
  "cargo": "administrador",
  "email": "malves224@clewsat.com",
  "contato": "1195424244",
  "password": "123456789",
  "newPassword": "87654321"
}
```

Algumas verificações

-   Caso o token não seja passado nos headers retorne o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna retorne o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401 com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```
- Caso o usuário autenticado não seja o mesmo do usuário que esta sendo editado retorna o status 401, com esse formato no corpo da response:

    ```json
    { "message": "Sem permisão para editar outros usuarios." }
    ```

- Caso seja passado a chave `idPerfil` retorna o status 401, com esse formato no corpo da response:

	~~~json
	{ "message": "Não é possivel editar o 'idPerfil', do próprio usuario." }
	~~~

- Caso seja passado uma senha invalida retorne o status 401, com esse formato no corpo da response:
  
    ```json
    { "message": "Senha invalida." }
    ```
- Caso de uso para trocar a senha:
	- caso a chave 'newPassword' esteja vazia/null  não deverá trocar a senha
	- caso a chave 'newPassword' esteja preenchida é preciso validar o formato da nova senha antes de efetivar a alteração.
	
-   Os campos nome, email, contato e newPassword segue um formato valido, segue exemplos de formatos validos:
    
    -   email:  fulano@email.com
    -   newPassword: senha igual ou maior a 8 digitos “12345678”, se o 'newPassword' não for passada na requisição ou esteja vazia não poderá ser validado o formato.
    -   nome: nome completo “fulado da silva”
    -   contato: 11943214567 ou 1122564588
    
    - caso algum campo esteja invalido deverá retornar uma mensagem no corpo da requisição exemplo:  
    ~~~json
    { "message": "'campo' com formato invalido" }
    ~~~
    
   - Caso esteja tudo certo, retorne o status 200 com o formato no corpo da response a seguir:

~~~json
{
  "id": 1,
  "nome": "MATHEUS ALVES DE OLIVEIRA",
  "cargo": "administrador",
  "email": "malves224@clewsat.com",
  "contato": "1195424244"
}
~~~
   

## 13º Requisito rota `GET` '/Users'
O endpoint retorna todos os usuários do sistema, é preciso passar o token do usuário nos headers da requisição.

Algumas verificações:

-   Caso o token não seja passado nos headers:  
    Retorne o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna retorne o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```
- Caso esteja tudo certo retorna o status 200, com todos usuários no corpo da response exemplo:
~~~json
[
  {
	"id": 1,
	"nome": "MATHEUS ALVES DE OLIVEIRA",
	"ouccupation": "administrador",
	"email": "malves224@clewsat.com",
	"contact": "1195424244",
	"idPerfil": 1
  },
  {
	"id": 2,
	"nome": "ANA carol",
	"ouccupation": "op. de cobrança",
	"email": "ana@clewsat.com",
	"contact": "1195424244",
	"idPerfil": 2
  },	
]
~~~

## 14º Requisito `GET` `/User/:id'

O endpoit retorna um único usuário baseado no id da rota, é preciso passar nos headers da requisição o token do usuário.

Algumas verificações:
-   Caso o token não seja passado nos headers:  
    Retorne o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna retorne o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```
  - Caso o id do Usuario da rota nao exista retorna o status 400, com esse formato no corpo da response: 
  
    ```json
    { "message": "Usuario não existe." }
    ```

   - Caso der tudo certo retorne status 200, com o seguinte formato no corpo da response: 
```json
{
  "id": 1,
  "nome": "MATHEUS ALVES DE OLIVEIRA",
  "occupation": "administrador",
  "email": "malves224@clewsat.com",
  "contact": "1195424244",
  "idPerfil": 1
}
```

## 15º Requisito `DELETE` /User/:id

O endpoint é capaz de excluir um usuario baseado no id que esta na rota, é preciso passar o token do usuarios no headers da requisição.

Algumas verificações:

-   Caso o token não seja passado nos headers:  
    Retorne o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Token nao encontrado" }
    ```
    
-   Caso o token esteja invalido ou expirado retorna retorne o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Token invalido ou expirado" }
    ```
    
-   Caso o usuário não tenha permissão de acesso correta retorna o status 401, com esse formato no corpo da response:
    
    ```json
    { "message": "Usuario não autorizado." }
    ```
  - Caso o id do Usuario da rota nao exista retorna o status 400, com esse formato no corpo da response: 
  
    ```json
    { "message": "Usuario não existe." }
    ```
  
  - Caso o usuario que está para excluir seja o unico 'admin' do sistema retorne o status 403, com esse formato no corpo da response: 

  ~~~json
  { "message":"Não é possivel excluir o unico administrador do sitema." }
  ~~~
  
  - Caso der tudo certo retorna o status 204, sem retorno no corpo da response.