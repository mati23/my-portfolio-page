# Roteiro de execução — ponto 5

Base: `main` em `962f09b` (merge do PR #2), atualizada em 08/09/2026. Branch: `codex/backend-containers-repositorio`.

## Método de execução

Executar uma etapa por interação, com alterações pequenas, validação e registro neste arquivo antes de encerrar. Não iniciar a seguinte na mesma interação. Em caso de limite de uso, retomar pelo primeiro item pendente e conferir o estado do Git; não repetir etapas concluídas. Commit/push/PR somente quando solicitados. As estimativas abaixo são relativas; não representam previsão de consumo de créditos.

Manter o site funcionando e a API opcional. O front-end só busca conteúdo estático em `src/content/catalog.js`; não depende de `/weatherforecast`. Manter esse endpoint demonstrativo e seu contrato até existir um requisito de negócio ou uma decisão explícita de remoção. Não adicionar banco, autenticação ou novas funcionalidades apenas para reorganizar a API.

## O que já existe

O PR #2 entregou build estático em múltiplos estágios com NGINX, headers de segurança, rotas diretas/404, imagens fixadas por digest, Node 24 e .NET 10, instalação com lockfiles, usuários sem root, health checks, API em profile opcional, métricas internas em 9464, remoção de bin/obj/dados do índice e pipeline de auditorias/testes. Não reconstruir essas soluções sem encontrar um problema concreto. As auditorias anteriores são evidências datadas; revalidar as imagens alteradas nas etapas correspondentes.

## Etapas

| Etapa | Escopo | Validação / critério de aceite | Estado |
| --- | --- | --- | --- |
| 1 — Higiene e contexto Docker (pequena) | Retirar `.DS_Store` e configuração local `.idea` do índice preservando arquivos locais; completar ignores para IDE, segredos locais e artefatos no contexto Docker. | Arquivos locais preservados; nenhum arquivo de máquina/bin/obj/dados rastreado; `git check-ignore`; revisão dos insumos de COPY e tratamento de VITE_SITE_URL. | Concluída em 08/09/2026 |
| 2 — Política de execução da API (média) | Corrigir comentário obsoleto sobre imagem sem shell; alinhar HTTP interno/TLS no ingress e CORS com configuração explícita. Remover o redirecionamento HTTPS incondicional no container sem certificado, preservando suporte explícito a desenvolvimento HTTPS. Não confiar em forwarded headers de qualquer origem. | Testes de health/forecast, origens permitidas/rejeitadas e preflight, Swagger restrito ao desenvolvimento, métricas isoladas mesmo com Host adulterado; ausência de redirecionamento indevido e avisos de porta HTTPS no modo de produção documentado. | Concluída em 08/09/2026 |
| 3 — Organização e erros da API (média) | Separar o endpoint demonstrativo e seu modelo da composição em Program.cs, mantendo Minimal API simples. Revisar tratamento centralizado de erros e logs estruturados sem expor detalhes internos; adicionar apenas o que falta. | Contrato de forecast inalterado; build com lock; teste significativo de tratamento de erro em ambiente de teste, sem adicionar endpoint de falha público ao produto. | Concluída em 08/09/2026 |
| 4 — Containers e Compose (média) | Testar Compose real com e sem profile backend; remover nome fixo de container para permitir projetos isolados; tornar portas configuráveis preservando defaults e restrição loopback da API. Revisar health, rede de métricas e contexto de build. Avaliar compressão NGINX para recursos textuais com medição e teste. | Subir um projeto temporário sem interferir em localhost:4173; health verde, rotas/404/CSP, API opcional e métricas não publicadas; teardown apenas do projeto de teste; scan das imagens efetivamente geradas. |
| 5 — CI e manutenção de dependências (média) | Inspecionar resultados reais do GitHub Actions, corrigir falhas encontradas, preservar evidências de falha, incluir lint de hooks e atualização automatizada de dependências em grupos pequenos. Avaliar redução de execuções duplicadas e verificar timeouts. | Workflow válido e execução real concluída com sucesso quando houver push autorizado; lint/testes/build/auditorias sem supressões novas. A execução remota permanece explicitamente pendente até ser observada. |
| 6 — Documentação e fechamento (pequena/média) | Consolidar comandos reais, política HTTP/TLS/CORS, portas, API demonstrativa opcional, coleta Prometheus e atualização/rollback. Conferir README e roteiro contra a implementação final. | Instalação reproduzível e verificação integrada final; relatório datado, limitações explícitas, todas as etapas anteriores concluídas. Não declarar ausência de vulnerabilidades desconhecidas. |

Para a etapa 4, o comando `docker compose` não estava disponível na sessão anterior, apesar de Docker funcionar. Verificar a disponibilidade no início da etapa e preparar o plugin oficial se necessário; validação sintática YAML não substitui subir o Compose.

## Checkpoint — etapa 1 concluída

- `.DS_Store` da raiz e do backend e os três arquivos `.idea` deixaram de ser rastreados, usando somente `git rm --cached`; as cópias locais foram preservadas.
- `.gitignore` impede a reintrodução da configuração local de IDE. Os ignores existentes de bin/obj/dados continuam em vigor.
- Contextos Docker excluem metadados locais; o front-end também exclui `.env*` (exceto o exemplo), relatórios Playwright e diretórios gerados. O conteúdo público, fontes, scripts e manifestos necessários ao build permanecem incluídos.
- Docker recebe o domínio por `ARG VITE_SITE_URL`, já encaminhado pelo Compose. Builds diretos com Vite continuam podendo usar `.env.production`; Docker não copia arquivos de ambiente locais para a imagem.
- Não houve alteração de código executável nem rebuild/deploy nesta etapa. Validação proporcional: índice/ignores, preservação dos arquivos locais e revisão dos COPY/ARG dos Dockerfiles.

## Checkpoint — etapa 2 concluída

- HTTP interno permanece sem redirecionamento por padrão; TLS termina no ingress. O profile `https` habilita redirecionamento explicitamente para 7139. Health e métricas internas permanecem acessíveis conforme a política anterior.
- CORS usa uma string de origens separadas por ponto e vírgula para permitir substituição completa por variável de ambiente, sem o merge parcial de arrays. Mantidos defaults anteriores em Production, acrescentadas URLs locais reais em Development. Origens inválidas ou redirecionamento sem porta válida impedem a inicialização.
- Nenhum middleware para confiar em forwarded headers foi adicionado. O contrato do forecast e a restrição de Swagger/métricas foram preservados; comentário obsoleto do health check corrigido.
- Build Docker da API concluído, incluindo restore bloqueado pelo lockfile. Testes na imagem `portfolio-backend:step2` passaram em Production, Development e Production com CORS sobrescrito; incluem GET/preflight permitido e rejeitado, ausência de redirecionamento indevido, ausência do aviso de porta HTTPS, headers adulterados, health, forecast e métricas. Também passaram o teste do destino de redirecionamento explícito e três cenários de configuração inválida.
- O teste de redirecionamento verifica status/Location sem seguir a resposta; não representa teste de handshake/certificado HTTPS nem de um ingress real. O profile local requer certificado de desenvolvimento configurado, conforme README.
- Trivy com base atualizada em 08/09/2026: zero vulnerabilidades detectadas na imagem final alterada. Esta etapa não repete a auditoria completa de todas as imagens nem certifica ausência de vulnerabilidades desconhecidas. Resumo em [backend-etapa2-validacao.json](backend-etapa2-validacao.json).
- Comando reproduzível: `docker build -t portfolio-backend:step2 backend`, seguido por `BACKEND_IMAGE=portfolio-backend:step2 python3 scripts/test-backend.py`. O teste também usa a imagem `portfolio-frontend:security` como cliente interno de métricas. Nenhum container persistente de aplicação foi substituído; os containers temporários dos testes foram removidos.

## Checkpoint — etapa 3 concluída

- Etapas 1 e 2 registradas no commit `6cd1279`, sem push.
- Endpoint e modelo movidos para `backend/Features/Weather`; mesma URL, nome OpenAPI, campos JSON, faixa de temperatura e datas. Sem novos serviços ou dependências.
- Middleware nativo de exceções encapsulado em `backend/Infrastructure/ApiErrors.cs`: HTTP 500 genérico com ProblemDetails e traceId em Production/Development. Logs JSON com escopos; diagnósticos do middleware explicitamente preservados no .NET 10, sem log duplicado da aplicação.
- Novo executável `tests/Backend.Errors` sem pacotes NuGet, reutilizando o código do middleware e Kestrel real em porta efêmera. Passaram os testes nos dois ambientes: Accept JSON/HTML, status/tipo de conteúdo, ausência de detalhes internos, traceId, uma ocorrência de log por falha, recuperação e 404. Esse teste valida o middleware compartilhado; a integração complementar verifica a imagem completa e a ausência da rota de falha no produto.
- Build Docker e regressão completa de `scripts/test-backend.py` passaram em `portfolio-backend:step3`, mantendo health/forecast/CORS/Swagger/métricas e verificações da etapa 2. Nenhum deploy persistente substituído.
- Trivy: zero vulnerabilidades detectadas na imagem final alterada; não é repetição da auditoria completa de todas as imagens. Resumo em [backend-etapa3-validacao.json](backend-etapa3-validacao.json).
- Teste de erros incluído na CI com restore locked; actionlint e git diff --check passaram. CI remota ainda não executada para estas alterações locais. Organização geral da CI continua na etapa 5.

**Próxima execução: etapa 4 — containers e Compose.** Verificar disponibilidade do plugin Compose, usar projeto e portas temporários e preservar os serviços locais existentes. Executar apenas essa etapa antes do próximo checkpoint.
