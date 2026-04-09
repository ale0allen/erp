# ERP - Sistema de Gestão (Estoque, Controle e Financeiro)

Projeto de estudo e desenvolvimento de um **ERP moderno** utilizando:

- **Backend:** Java + Spring Boot
- **Frontend:** React + TypeScript
- **Banco de dados:** PostgreSQL
- **Infra:** Docker
- **Controle de versão:** Git + GitHub

O objetivo do projeto é evoluir para um sistema completo contendo módulos de:

- Cadastro
- Produtos
- Estoque
- Financeiro
- Usuários
- Permissões

---

# Arquitetura do Projeto
Frontend (React)
↓
API REST (Spring Boot)
↓
Service Layer
↓
Repository (JPA)
↓
PostgreSQL

---

# Estrutura do Projeto
erp/
├── backend/ -> API Spring Boot
├── frontend/ -> Aplicação React + TypeScript
├── docker-compose.yml -> PostgreSQL via Docker
└── README.md


---

# Tecnologias Utilizadas

## Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Flyway
- PostgreSQL
- Maven

## Frontend

- React
- TypeScript
- Vite

## Infraestrutura

- Docker
- Docker Compose

## Ferramentas recomendadas

- IntelliJ / Eclipse / Cursor → Backend
- VS Code → Frontend
- Postman → Teste da API

---

# Pré-requisitos

Antes de rodar o projeto, instale:

- Git
- JDK 21
- Docker Desktop
- Node.js (LTS)
- Postman
- IDE ou editor de código

---

# Como clonar o projeto
git clone URL_DO_REPOSITORIO
cd erp


---

# Subindo o banco de dados

Na raiz do projeto:
docker compose up -d


Verifique se o container está rodando:

docker ps

---

# Rodando o Backend

Abra um terminal e execute:
cd backend
./mvnw spring-boot:run


Backend disponível em:


http://localhost:8080


---

# Rodando o Frontend

Abra outro terminal:


cd frontend
npm install
npm run dev


Frontend disponível em:


http://localhost:5173


---

# Fluxo de execução do sistema

Durante o desenvolvimento normalmente rodamos **3 processos**.

### Terminal 1 — Banco


docker compose up -d


### Terminal 2 — Backend


cd backend
./mvnw spring-boot:run


### Terminal 3 — Frontend


cd frontend
npm run dev


---

# Banco de dados atual

Migration criada via Flyway:

```sql
CREATE TABLE produto (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(200) NOT NULL,
    preco_custo NUMERIC(15,2),
    preco_venda NUMERIC(15,2),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);
Endpoints disponíveis
Listar produtos

GET /produtos


Exemplo:


http://localhost:8080/produtos


Resposta:

[
  {
    "id": 1,
    "codigo": "P001",
    "nome": "Teclado Mecânico",
    "precoCusto": 120.00,
    "precoVenda": 199.90,
    "ativo": true
  }
]
Criar produto

POST /produtos


Body JSON:

{
  "codigo": "P002",
  "nome": "Mouse Gamer",
  "precoCusto": 80.00,
  "precoVenda": 149.90,
  "ativo": true
}

Resposta esperada:

{
  "id": 2,
  "codigo": "P002",
  "nome": "Mouse Gamer",
  "precoCusto": 80.00,
  "precoVenda": 149.90,
  "ativo": true
}
Testes da API no Postman
Criar Collection

Nome sugerido:


ERP - Produtos


Criar dois testes:


GET - Listar produtos
POST - Criar produto

Teste automático GET

Na aba Tests do Postman:

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is array", function () {
    const jsonData = pm.response.json();
    pm.expect(Array.isArray(jsonData)).to.eql(true);
});
Teste automático POST
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Produto possui ID", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.id).to.not.equal(null);
});
Problemas comuns
Backend não sobe

Verifique:

Java 21 instalado

Porta 8080 livre

Banco rodando

Frontend não comunica com backend

Verifique:

backend rodando

CORS configurado

console do navegador

Erro ao salvar produto

Pode ocorrer por:


codigo duplicado


Pois a coluna codigo é única no banco.

Próximos passos do projeto

Evoluções planejadas:

Separar Entity de DTO

Tratamento global de exceções

Melhorar estrutura do frontend

Implementar update e delete

Criar módulo de estoque

Criar módulo financeiro

Criar autenticação de usuários

Estrutura futura do sistema

ERP
├ Cadastro
│ ├ Produtos
│ ├ Clientes
│ └ Fornecedores
│
├ Estoque
│ ├ Movimentações
│ └ Ajustes
│
├ Financeiro
│ ├ Contas a pagar
│ └ Contas a receber
│
└ Configurações
└ Usuários

Padrão de branches

Sugestão de fluxo Git:


main
develop
feature/nome-da-feature


Exemplo:


feature/cadastro-produto

Autor

Projeto em desenvolvimento para estudo e evolução de um ERP completo utilizando tecnologias modernas.


---

# Recomendo MUITO fazer agora também

Adicionar **um arquivo `CONTRIBUTING.md`** explicando:

- padrão de commits
- como criar branches
- como rodar o projeto

Isso deixa o projeto muito mais organizado se mais pessoas entrarem.

Se quiser, no próximo passo eu também posso te mostrar:

✅ **como criar uma Collection do Postman exportável (.json)**  
✅ **como versionar ela dentro do projeto**  
✅ **como criar Swagger automaticamente no Spring Boot**

Isso deixa a API muito mais profissional.
