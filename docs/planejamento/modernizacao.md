# Plano de modernização do portfólio

Data: 07/09/2026. Base analisada: `main`, commit `e07c0ff`. Branch: `codex/plano-modernizacao`.

Escopo desta entrega: diagnóstico e planejamento. Nenhum código, pacote, lockfile, imagem ou configuração de execução foi alterado. As correções abaixo são trabalho futuro.

## 1. Diagnóstico e direção recomendada

O projeto é uma SPA React/Vite com cinco rotas, conteúdo em JSON/Markdown e imagens em `frontend/public/resources`, CSS Modules e Tailwind, além de uma cena Three.js na home. As chamadas `fetch` encontradas leem arquivos estáticos; não há consumo da API .NET no front-end.

O back-end é uma Minimal API ASP.NET Core 8 com `/weatherforecast` de exemplo, Swagger em desenvolvimento e `/metrics`. Não foram encontrados persistência, autenticação ou regras de negócio. O Compose atual inicia somente o front-end.

**Recomendação:** manter inicialmente a SPA e publicar seu build estático em servidor apropriado. Antes de investir na API, decidir se ela será uma demonstração técnica independente ou terá requisitos reais de negócio. Se não houver uso previsto, propor sua retirada do deploy e posterior remoção do repositório em alteração separada. Não há justificativa atual para microserviços, banco, CQRS ou uma arquitetura com muitas camadas.

## 2. Inventário e estratégia de atualização

Versões JavaScript abaixo são as resolvidas no lockfile, não apenas os intervalos declarados. Os destinos são linhas propostas; confirmar patches, suporte e advisories no início de cada implementação.

| Item | Estado encontrado | Plano |
| --- | --- | --- |
| Node.js | Docker `node:20`; ambiente local 20.20.2 | Migrar build e desenvolvimento para Node 24 LTS, fixar versão e gerenciador. Node 20 está fora de suporte. [Ciclo oficial](https://nodejs.org/en/about/previous-releases). |
| Vite / plugin React | 4.3.9 / 3.1.0 | Migrar para linha suportada Vite 8, com plugin compatível, revisando guias de cada major intermediária. Validar assets e novo bundler. [Suporte](https://vite.dev/releases), [Vite 8](https://vite.dev/blog/announcing-vite8). |
| React / React DOM | 18.2.0 | Passar por 18.3 para avisos de migração e chegar à linha 19 com patches atuais; alinhar tipos. Resolver primeiro o extrator de cores. [Guia oficial](https://react.dev/blog/2024/04/25/react-19-upgrade-guide). |
| React Router DOM | 6.11.2 | Atualizar e aplicar migração gradual 6 → 7 → linha estável suportada, verificando advisories em cada etapa. Preservar modo declarativo e URLs; não adicionar SSR apenas para atualizar. [Documentação](https://reactrouter.com/). |
| react-color-extractor | 1.1.2, peer React `^16.3.2` | Incompatibilidade declarada com React 18. Preferir cores pré-calculadas no conteúdo estático; avaliar alternativa mantida somente se extração dinâmica for requisito. |
| react-markdown | 8.0.7 | Atualizar para versão estável compatível e trocar import interno `react-markdown/lib/react-markdown` pela API pública. Verificar links, imagens e Markdown existente. |
| Three.js | 0.150.1 | Corrigir ciclo de vida antes do upgrade; revisar mudanças de releases, imports de addons, iluminação e pós-processamento até a versão estável escolhida. Comparação visual obrigatória. |
| Tailwind | 3.3.2 | Separar migração para v4 das atualizações de segurança. Confirmar navegadores-alvo; se necessário, usar 3.4 como etapa intermediária. Preservar breakpoints personalizados. [Guia e compatibilidade](https://tailwindcss.com/docs/upgrade-guide). |
| PostCSS / Autoprefixer | 8.4.24 / 10.4.14 | Atualizar para versões corrigidas e compatíveis; rever necessidade do pipeline após decisão sobre Tailwind. |
| .NET | `net8.0`, imagens SDK/runtime 8.0 | Se mantido, migrar para .NET 10 LTS e fixar SDK via `global.json`. .NET 8 termina suporte em 10/11/2026; .NET 10 tem suporte até 14/11/2028. [Política oficial](https://dotnet.microsoft.com/en-us/platform/support/policy). |
| NuGet diretos | OpenApi 8.0.7; prometheus-net.AspNetCore 8.2.1; Swashbuckle 6.4.0 | Auditar diretos/transitivos, escolher versões compatíveis com framework-alvo e decidir entre OpenAPI nativo e Swashbuckle. Não manter duas soluções sem necessidade. |

Antes de atualizar: eliminar as chaves repetidas de `@vitejs/plugin-react` e a duplicação de Vite/plugin entre dependencies e devDependencies; manter ferramentas de build apenas em desenvolvimento. Resolver os peers sem `--force`, usar `npm ci` e regenerar o lockfile somente na implementação. O lockfile da raiz está vazio e não tem manifesto correspondente: confirmar ausência de uso e removê-lo nessa etapa.

## 3. Segurança: evidências e pendências

Foi executado em `frontend`: `npm audit --package-lock-only --ignore-scripts --json`, sem instalação, scripts de dependências ou correção automática. Evidência completa: [npm-audit-2026-09-07.json](npm-audit-2026-09-07.json).

Resultado retornado pelo registro: **30 dependências vulneráveis — 1 crítica, 14 altas, 12 moderadas e 3 baixas**. A contagem agrupa pacotes afetados, inclusive propagação transitiva; não equivale à quantidade de CVEs independentes nem comprova exploração no deploy. O código de saída 1 representa achados nesta execução.

| Prioridade | Evidência | Ação futura e verificação |
| --- | --- | --- |
| P1 | `@babel/traverse` 7.22.4, crítico: execução de código ao compilar entrada maliciosa ([GHSA](https://github.com/advisories/GHSA-67hx-6x53-jw92)) | Atualizar cadeia Babel/plugin, verificar lockfile e repetir auditoria. Investigar exposição do build a contribuições não confiáveis; não classificar como execução remota no navegador. |
| P1 | Vite alto; esbuild moderado; servidor dev configurado com `host: true` ([advisory Vite](https://github.com/advisories/GHSA-c24v-8rfc-w8vw)) | Atualizar toolchain, restringir exposição do desenvolvimento e substituir preview em produção. Confirmar quais advisories afetam dev, preview ou bundle; não assumir que todas as falhas de dev existem em preview. |
| P1 | Router alto e Rollup alto ([Router](https://github.com/advisories/GHSA-2w69-qvjg-hvjx), [Rollup](https://github.com/advisories/GHSA-gcx4-mw62-g8wm)) | Atualizar e testar navegação/URLs externas e saída do bundle. Não foi identificado SSR; advisories exclusivos de hidratação SSR precisam ser classificados como não aplicáveis ao uso atual, com justificativa. |
| P1 | Outros achados em PostCSS, glob/regex, lodash, Jimp e parsers transitivos | Mapear cadeia com `npm explain`, atualizar pacote responsável ou remover funcionalidade/dependência desnecessária. Não usar overrides incompatíveis como solução permanente. |
| P1 | Node 20 fora de suporte; NuGet e imagens ainda não auditados | Auditar SDK/runtime, pacotes diretos e transitivos e imagem final antes de qualquer publicação. |
| P2 | `/metrics` sem proteção explícita; dados Prometheus versionados | Se API mantida, restringir métricas à rede interna/ingress e revisar dados antes de deixar de versioná-los. Não foi verificada exposição pública real. |

Na implementação, produzir inventário com pacote/versão, cadeia transitiva, advisory, severidade, contexto (build, navegador, servidor), pré-condições, correção e risco residual. Executar auditoria completa e também `--omit=dev`; a segunda não substitui a primeira porque ferramentas de build também afetam a cadeia de entrega.

Para .NET, restaurar em cópia isolada e executar `dotnet list backend/backend.csproj package --vulnerable --include-transitive` e `--outdated`, registrando o grafo restaurado e as fontes consultadas. Auditar imagens com scanner de containers e revisar segredos no código e histórico com saída redigida. Não excluir dados nem reescrever histórico automaticamente; eventual segredo confirmado exige rotação e tratamento específico.

Critério de saída: nenhuma vulnerabilidade crítica/alta aplicável sem correção; exceções precisam de justificativa verificável, responsável e prazo. Moderadas/baixas também devem ser corrigidas quando houver atualização compatível, ou explicitamente triadas. Resultado vazio do scanner não certifica ausência de vulnerabilidades.

## 4. Correções e evolução do front-end

1. **P1 — Estabilizar o 3D.** Em `HomeComponent/index.jsx`, o efeito não possui dependências nem cleanup e substitui diretamente o canvas controlado pelo React. Em `initiateThreeJS.js`, três loops de animação não são cancelados; geometrias, materiais, composer e renderer não são descartados. `animateSmoke` agenda callback que receberá um timestamp em vez do array esperado. Os loops `<= 4` acessam a quinta posição de arrays com quatro elementos. Corrigir esses pontos, usar contêiner com ref e função de desmontagem, acompanhar resize e respeitar movimento reduzido. Validar montagem/desmontagem repetida em StrictMode, ausência de erros e estabilidade de memória/GPU.
2. **P1 — Corrigir carregamento de resenhas.** `BookReviewComponent` busca metadados após cada render; o Markdown usa efeito vazio e não acompanha mudança de `bookId`. Planejar dependência por ID, cancelamento/controle de respostas antigas, `response.ok`, loading, erro e livro inexistente. Fazer o mesmo para thumbnails e favoritos. Não presumir loop infinito: o problema confirmado é efeito executado em todo render.
3. **P2 — Consolidar conteúdo e requisições.** `MyTopComponent` monta todos os anos e cinco componentes por ano; cada categoria busca o mesmo JSON. Carregar uma vez por ano, compartilhar dados e usar catálogo explícito de livros/anos com validação de campos e slugs. Separar apresentação de acesso aos dados sem introduzir biblioteca de estado global por padrão.
4. **P2 — Organizar rotas e componentes.** Criar layout comum com Navbar, rota 404 e links internos do router; testar acesso direto e refresh em rotas aninhadas. `src/routes/root.jsx` está fora do fluxo atual e importa caminho inexistente: remover ou integrar corretamente. Separar páginas, componentes reutilizáveis, conteúdo e hooks; adotar TypeScript gradualmente se trouxer valor aos contratos de conteúdo.
5. **P2 — Acessibilidade e desempenho.** Revisar menu móvel, teclado/foco, nomes acessíveis, imagens sem `alt`, hierarquia de títulos e IDs repetidos entre anos. Carregar Three.js sob demanda, limitar resolução/pixel ratio e oferecer fallback sem WebGL. Medir bundle e imagens, otimizar formatos/dimensões e fontes após baseline. Revisar textura 3D externa e logo de exemplo Flowbite: substituir por assets próprios quando aplicável e verificar licenças.
6. **P3 — SEO e estilos.** Metadados por página, preview social e eventual pré-renderização se indexação das resenhas for requisito. Evitar migração completa de framework sem medir essa necessidade. Reduzir imports redundantes, estado que apenas copia props, logs e mistura desnecessária de estilos globais e Modules.

## 5. Back-end, containers e repositório

- **P1 — Produção estática:** Docker atualmente usa `npm install --force`, instala Vite global `latest` nos dois estágios e executa `vite preview`. Usar build reproduzível em múltiplos estágios e servir apenas `dist` via servidor estático/CDN com fallback SPA, cache adequado, compressão e headers. O próprio [Vite esclarece que preview não é servidor de produção](https://vite.dev/guide/static-deploy). Configurar CSP após inventariar recursos externos, sem quebrar estilos/assets existentes.
- **P2 — API se mantida:** manter Minimal API pequena, retirar endpoint de exemplo quando houver contrato real e organizar endpoints por funcionalidade. Acrescentar health checks, erros padronizados, logs estruturados e testes de integração proporcionais. Autenticação, autorização e rate limiting dependem dos endpoints futuros; ausência de autenticação em previsão pública não é por si só vulnerabilidade.
- **P1 — Coerência de implantação:** `EXPOSE 5126` não configura a porta de escuta da API; explicitar URL/porta e validar com a imagem. Alinhar CORS com origens reais, TLS/redirecionamento com o reverse proxy e métricas com a rede correta. `localhost:5126` no Prometheus só aponta à API se compartilharem o contexto de rede apropriado. O campo `proxy` no package.json não configura proxy do Vite; usar configuração real apenas se a API passar a ser consumida.
- **P2 — Containers:** escolher usuário sem privilégios, imagens mantidas e política de digest/atualização, `.dockerignore` no backend, health checks e volumes de dados separados. Corrigir comentário de NGINX no Compose, que hoje publica preview na porta 4173.
- **P2 — Higiene:** `backend/bin`, `backend/obj` e `backend/data` estão rastreados. Planejar `.gitignore` na raiz e retirada desses artefatos do índice preservando dados úteis fora do repositório. Isso não apaga cópias antigas do histórico. Revisar necessidade de limpeza histórica em ação separada.
- **P2 — Documentação e CI:** README raiz com comandos reais por diretório e portas; corrigir instruções Docker e script inexistente `docker-stop`. Criar pipeline para instalação reproduzível, lint/hooks, testes essenciais, build, auditoria npm/NuGet e scan da imagem; atualização automatizada de dependências em lotes pequenos. Não foram encontrados testes ou workflows de CI versionados na inspeção.

## 6. Sequência de execução futura

| Etapa / entrega sugerida | Dependência | Critério de aceite |
| --- | --- | --- |
| 0. Baseline e decisão sobre API | Nenhuma | Registrar ambiente/deploy real, rotas e aparência; reproduzir build em ambiente isolado; auditar NuGet/imagens; documentar papel da API e navegadores suportados. |
| 1. Instalação e toolchain seguras | 0 | Node LTS, manifesto sem duplicações, peers resolvidos, lock reproduzível sem force; Vite/plugin e transitivas corrigidos; auditoria comparada. |
| 2. Correções funcionais do frontend | 1; reproduções podem começar em 0 | Home sem erros/leaks observáveis em navegação repetida; resenhas corretas ao trocar ID; erros/404 tratados; favoritos sem fetch duplicado por categoria. |
| 3. Atualização de bibliotecas de UI | 1 e 2 | React/DOM/tipos alinhados, Router e Markdown migrados, extrator resolvido; 3D e Tailwind em alterações separadas com comparação visual. |
| 4. API: manutenção ou desativação | Decisão em 0 | Se mantida: .NET LTS, NuGet auditado, portas/TLS/métricas testados. Se retirada: demonstrar que o site e deploy não dependem dela. |
| 5. Deploy, higiene e CI | 1; finalizar após 3/4 | Imagem mínima auditada, rotas diretas funcionando, artefatos removidos do índice com dados preservados, documentação reproduzível e checks automáticos verdes. |

Cada etapa deve ser uma alteração pequena e revisável; Three.js e Tailwind merecem entregas próprias. Não aplicar `npm audit fix --force` ou upgrades de todas as majors em um único lote. Não atrasar mitigação de segurança por uma reorganização estética.

Validação futura: instalação limpa; lint com regras de hooks; testes de comportamento para troca de livro, falhas HTTP e navegação; smoke E2E das cinco rotas, 404 e refresh direto; comparação desktop/mobile, teclado e movimento reduzido; verificação do ciclo 3D; build de produção e auditorias. Se a API permanecer, incluir health, contrato de endpoints e acessibilidade de métricas conforme política. Registrar tamanhos/tempos antes de definir metas de desempenho.

Rollback: preservar commit e artefato de deploy anteriores por etapa; reverter alterações completas com seu lockfile se houver regressão. Não republicar deliberadamente uma versão vulnerável como solução definitiva: rollback de emergência exige mitigação e correção prioritária.

## 7. Limites desta análise

A análise foi estática, com auditoria online do lockfile npm e consulta à documentação oficial. Não foram instalados pacotes, executados builds/testes, iniciados serviços ou modificados ambientes de produção. O SDK local disponível é 10.0.201; Docker não foi encontrado no PATH. Auditorias NuGet, containers e histórico de segredos ainda fazem parte da etapa 0. Não há conclusão de que backend ou imagens estejam livres de CVEs. Bugs apontados no código precisam de reprodução e testes na implementação. Versões e advisories devem ser revalidados na data de execução.
