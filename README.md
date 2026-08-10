# Dicionário Angular Moderno

Um glossário interativo com os principais termos, conceitos e depreciações do Angular, organizado por versão (v14 a v22), em uma lista geral pesquisável e em uma lista de itens descontinuados — com busca, filtros e paginação.

## Sobre o projeto

Projeto de estudo criado para consolidar conhecimento sobre as features mais recentes do Angular — Signals, novo control flow, deferrable views, zoneless, entre outras — enquanto elas eram documentadas em forma de dicionário.

As informações foram organizadas em três visões (abas):

- **Mudanças por versão**: o que foi introduzido em cada release do Angular, de v14 a v22.
- **Todos os termos**: um glossário geral (fundamentos, ciclo de vida, DI, Signals, formulários, roteamento, HTTP, testes, CLI, SSR, entre outras categorias), com busca por texto, filtro por categoria, ordenação alfabética e paginação.
- **Descontinuados**: APIs, pacotes e ferramentas que saíram de uso ou tiveram uso desencorajado desde a v14 (ex.: `ComponentFactoryResolver`, `HttpClientModule`, `*ngIf`/`*ngFor`/`*ngSwitch`, `@angular/animations`, Protractor), cada um com a versão de depreciação e a alternativa recomendada — também com busca e paginação. Os dados foram levantados a partir do guia oficial de depreciações e do `CHANGELOG.md` do repositório `angular/angular`.

## Stack

- [Angular 21](https://angular.dev) — standalone components, Signals (`signal`, `computed`, `model`) e novo control flow (`@if`, `@for`, `@switch`)
- TypeScript
- SCSS (design próprio, sem bibliotecas de UI)
- Tipografia [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

## Estrutura

Além do componente principal (`app`), a busca e a paginação foram extraídas em componentes standalone reutilizáveis, usados tanto na aba "Todos os termos" quanto em "Descontinuados":

- `src/app/busca` — campo de busca com two-way binding via `model()`.
- `src/app/paginacao` — navegação de páginas (anterior/próxima, números com reticências), recebendo página atual e total via `input()` e emitindo a página escolhida via `output()`.

## Rodando localmente

```bash
npm install
ng serve
```

Depois é só acessar `http://localhost:4200/`. A aplicação recarrega automaticamente a cada alteração nos arquivos.

## Build de produção

```bash
ng build
```

Os artefatos ficam disponíveis na pasta `dist/`.

## Aviso

Este é um projeto pessoal de estudo, não é um material oficial do Angular. As informações apresentadas devem ser sempre conferidas na [documentação oficial](https://angular.dev).
