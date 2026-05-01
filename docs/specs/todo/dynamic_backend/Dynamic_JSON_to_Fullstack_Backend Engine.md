# Spec: Dynamic JSON-to-Fullstack Backend Engine

## 1. Visão Geral
Este documento especifica os requisitos para um backend dinâmico capaz de gerenciar esquemas de interface (JSON) e os dados submetidos por eles. O sistema deve suportar versionamento de esquemas, gerenciamento de rascunhos (drafts) e publicações (releases), utilizando uma arquitetura escalável e custo-eficiente.

## 2. Stack Tecnológica
- **Runtime:** Node.js + TypeScript (compartilhamento de tipos e validações com o Frontend).
- **ORM:** Drizzle ORM (escolhido pelo suporte nativo a JSON no SQLite e performance).
- **Banco de Dados:** 
    - Desenvolvimento/MVP: SQLite (banco em arquivo).
    - Escala Horizontal: PostgreSQL ou Turso (libSQL).
- **Identificadores:** UUID v4 para todas as chaves primárias.

## 3. Modelo de Dados (Drizzle Schema)

### 3.1. Tabela: Schemas
Armazena a existência de um componente ou tela.
- `id` (text/uuid): Chave primária.
- `name` (text): Nome único da entidade (ex: 'user-profile').
- `currentPublishedVersion` (integer): Ponteiro para a versão ativa.
- `createdAt` (timestamp).

### 3.2. Tabela: SchemaVersions
Armazena o histórico de definições (JSON) e o controle de releases.
- `id` (text/uuid): Chave primária.
- `schemaId` (text): FK para `schemas.id`.
- `versionNumber` (integer): Sequencial da versão.
- `definition` (json): O `ComponentSchema` completo.
- `status` (text): 'draft' | 'published' | 'archived'.
- `publishedAt` (timestamp): Data da última publicação.

### 3.3. Tabela: Entities
Armazena os dados reais preenchidos pelo usuário final.
- `id` (text/uuid): Chave primária.
- `schemaKey` (text): Nome do esquema (denormalizado para facilitar filtros).
- `schemaVersion` (integer): Versão do contrato usada no momento da criação.
- `data` (json): Coluna JSONB contendo os pares chave/valor dinâmicos.
- `updatedAt` (timestamp).

## 4. Estratégia de API e Filtros Dinâmicos

### 4.1. Filtros no JSON (SQLite/Postgres)
O sistema deve utilizar o operador `->>` (ou `json_extract`) para realizar buscas performáticas dentro da coluna `data`.
- **Filtro Retroativo:** Caso um campo não exista em versões antigas do dado, o backend deve tratar o retorno como `NULL` ou utilizar `COALESCE` para definir valores padrão em tempo de execução.
- **Expansão e Contração:** Não realizaremos migrações de dados obrigatórias em mudanças de esquema; a aplicação deve ser resiliente a campos ausentes.

### 4.2. Endpoints Requeridos
- `GET /meta/:name`: Retorna a definição do esquema com `status = 'published'`.
- `POST /meta/:name/release`: Promove um rascunho a público e arquiva a versão anterior.
- `GET /api/:schema_name`: Lista dados. Deve suportar query params para filtros dinâmicos (ex: `?param1=valor`) e seleção de campos (`?fields=a,b`).
- `POST /api/:schema_name`: Recebe dados, valida contra a definição atual e persiste em `entities`.

## 5. Regras de Negócio Críticas
1. **Validação Unificada:** O backend DEVE importar as funções de validação e tipos de `ComponentSchema` do diretório compartilhado com o frontend.
2. **Imutabilidade de Versão:** Versões com status `published` ou `archived` não podem ser editadas, apenas visualizadas. Novas alterações devem gerar um novo `draft`.
3. **Escalabilidade Vertical para Horizontal:** O código deve evitar comandos específicos de SQLite que não possuam equivalente em PostgreSQL (preferir sintaxe padrão do Drizzle).

## 6. Prompt para o Agente de Código
"Utilizando o Drizzle ORM e o driver `better-sqlite3`, crie a estrutura de tabelas definida neste documento. Implemente uma rota genérica de GET que utilize a função `sql` do Drizzle para extrair e filtrar campos de uma coluna JSON, tratando corretamente a ausência de chaves em registros de versões anteriores."