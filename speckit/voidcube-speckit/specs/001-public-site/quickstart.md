# Quickstart: VoidCube

## Scope

Este guia prioriza a primeira entrega do site público. Frontend e backend são repositórios independentes. A autenticação OAuth/OIDC não precisa ser configurada enquanto o Login for apenas visual.

## Prerequisites

Ambiente principal de desenvolvimento:

- Windows;
- Node.js na versão LTS adotada pelo projeto;
- npm;
- Java na versão LTS adotada pelo projeto para trabalho de backend;
- Gradle;
- Docker;
- Git;
- MySQL via Docker quando o backend for necessário.

As versões efetivamente adotadas devem permanecer documentadas em cada repositório.

## Repositories

Frontend e backend devem ser clonados independentemente e podem existir em diretórios diferentes.

```text
voidcube-frontend
voidcube-backend
```

Não existe dependência de uma pasta pai compartilhada.

## Frontend - First Delivery

Stack:

- Astro;
- React;
- TypeScript;
- Tailwind;
- npm.

Fluxo esperado usando os scripts definidos pelo repositório:

```powershell
cd <caminho-do-voidcube-frontend>
npm install
npm run dev
```

O ambiente de desenvolvimento do frontend deve utilizar a porta `3000`.

Para validar a entrega:

```powershell
npm run build
```

A validação mínima do Quickstart é:

1. frontend acessível localmente;
2. build de produção concluído.

Os testes e gates completos permanecem definidos em `checklists/release-requirements.md` e `tasks.md`.

## Environment Configuration

Cada repositório deve fornecer `.env.example` com as configurações necessárias. Segredos reais ficam fora do código e não devem ser commitados.

## Backend - Future Platform Work

Porta padrão: `8080`.

O backend utiliza Java Spring Boot, Gradle e Flyway. Migrations devem ser executadas automaticamente pelo backend durante o fluxo local definido pelo projeto.

Execução esperada deve usar o Gradle Wrapper do repositório, por exemplo:

```powershell
cd <caminho-do-voidcube-backend>
.\gradlew.bat bootRun
```

O comando exato deve seguir os scripts e configuração reais do repositório.

## MySQL via Docker

Porta padrão: `3306`.

O MySQL deve ser iniciado separadamente via `docker run`, usando as variáveis definidas no `.env`/`.env.example` do backend. A imagem e a versão devem seguir a versão adotada e documentada pelo projeto.

Exemplo estrutural:

```powershell
docker run --name voidcube-mysql --env-file .env -p 3306:3306 mysql:<versao-do-projeto>
```

## OAuth/OIDC

Não configurar OAuth/OIDC para a primeira entrega pública. Essa configuração entra somente quando autenticação e dashboard funcionais forem implementados.

## Local Ports

| Serviço | Porta |
|---|---:|
| Frontend | 3000 |
| Backend | 8080 |
| MySQL | 3306 |

## Deployment

O frontend da primeira entrega é publicado no Cloudflare Pages. O backend e MySQL futuros serão hospedados separadamente em VPS com Docker.
