# Guia para implementação de novas funcionalidades

Primeiro coisa que temos que ter em mente que o sistema tem funcionalidades de verificar permissão de acesso e permissão de ações como editar, excluir, criar uma determinada entidade, e para isso continuar funcionando precisamos seguir algumas regras de padronização.


## Passo a passo para criação de uma nova pagina/tela.


### 1º Passo definer o nome da pagina.

Precisamos escolher um nome para essa pagina/tela que faça sentido. o nome da pagina deve ser o mesmo nome da rota, exemplo: uma pagina chamada 'NewSales' deve ter a rota /'NewSales' para acessar a pagina de Sales.

### 2º Passo definer se a pagina vai ter vinculo com algum item do menu.

O frontend tem uma barra de navegação onde cada item do menu pode levar para uma ou mais pagina, caso essa pagina precise estar nessa barra de navegação é preciso vincular a pagina que esta sendo criada a um item do menu para que o usuario possa acessar, exemplo: uma pagina chamada 'NewSales' deve ter o vinculo ao um item do menu, para fazer essa relação é preciso inserir no banco de dados a pagina na tabela 'pages', com os campos name: que é o nome que irá aparecer no menu, route: rota que acessa essa pagina, id_menu: aqui se faz o vinculo de page pertence a um item do menu, caso nao exista o item do menu adequado para a feature é preciso criar lo na tabela 'menu_items', caso a pagina em questão nao irá aparacer na barra de navegação basta omitir o campo id_menu.

### 3º Passo Definer as actions dessa pagina.

Uma pagina pode varias actions em varias entidades, Action é a ação que irá afetar um determinada entidade. pra isso é preciso inserir na tabela action os seguintes campos, id_page: id da pagina, entity: entidade que a pagina esta manipulando, e os campos edit, delete, create, get, deve receber boleanos, exemplo caso a pagina edit algo é preciso passar true para esse campo.

## Instruções para editar paginas ja existente.

Caso a pagina precise se deslocar no menu é preciso atualizar no banco de dados qual o item do menu ela pertence.
Se a nova feature envolve manipular uma nova entidade é preciso criar uma nova action no banco de dados para essa pagina na tabela action, Vinculando essa nova action á uma page pelo campo id_page, uma page pode possuir varias actions.

OBS: Uma vez que o usuario possui permisão de acesso para tal pagina e essa pagina manipula diversas entidades essa permisão ira ser aplicada a todas entidades, incluindo ações.