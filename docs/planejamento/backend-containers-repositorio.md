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
| 4 — Containers e Compose (média) | Testar Compose real com e sem profile backend; remover nome fixo de container para permitir projetos isolados; tornar portas configuráveis preservando defaults e restrição loopback da API. Revisar health, rede de métricas e contexto de build. Avaliar compressão NGINX para recursos textuais com medição e teste. | Subir um projeto temporário sem interferir em localhost:4173; health verde, rotas/404/CSP, API opcional e métricas não publicadas; teardown apenas do projeto de teste; scan das imagens efetivamente geradas. | Concluída em 08/09/2026 |
| 5 — CI e manutenção de dependências (média) | Inspecionar resultados reais do GitHub Actions, corrigir falhas encontradas, preservar evidências de falha, incluir lint de hooks e atualização automatizada de dependências em grupos pequenos. Avaliar redução de execuções duplicadas e verificar timeouts. | Workflow válido e execução real concluída com sucesso quando houver push autorizado; lint/testes/build/auditorias sem supressões novas. A execução remota permanece explicitamente pendente até ser observada. | Implementação e validação local concluídas; execução remota pendente |
| 6 — Documentação e fechamento (pequena/média) | Consolidar comandos reais, política HTTP/TLS/CORS, portas, API demonstrativa opcional, coleta Prometheus e atualização/rollback. Conferir README e roteiro contra a implementação final. | Instalação reproduzível e verificação integrada final; relatório datado, limitações explícitas, todas as etapas anteriores concluídas. Não declarar ausência de vulnerabilidades desconhecidas. |

Na etapa 4, foi instalado o plugin Compose 5.5.1 via Homebrew e registrado no diretório de plugins do Docker. O teste executa o Compose real, não apenas validação sintática YAML.

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

## Checkpoint — etapa 4 concluída

- Etapa 3 registrada no commit `86cc0b9`, sem push.
- Removido `container_name` fixo. Portas externas configuráveis por `FRONTEND_PORT`/`BACKEND_PORT`, com defaults 4173/5126 preservados. Site permite configurar bind (default 0.0.0.0); backend mantém obrigatoriamente loopback. Porta de métricas não publicada.
- Gzip habilitado apenas para formatos textuais elegíveis, com negociação e Vary. Medição no NGINX real: HTML da home de 1.072 para 496 bytes; JavaScript inicial de 188.977 para 62.655 bytes (66,8% menor). Conteúdo descomprimido comparado byte a byte com resposta identity; sem alegação de redução de latência.
- `scripts/test-compose.py` constrói projetos isolados, usa portas efêmeras e testa front-end sem API, profile backend e duas instâncias simultâneas. Passaram health, rotas diretas, 404, CSP, gzip, forecast, usuários sem root, DNS backend e coleta interna de métricas. Defaults de portas/binds também conferidos via config JSON.
- Containers e redes dos dois projetos temporários removidos; imagens preservadas para auditoria. Nenhum serviço persistente substituído. No início desta etapa não havia containers em execução.
- Trivy sem vulnerabilidades detectadas nas duas imagens finais exatas usadas pelo Compose; IDs conferidos contra os relatórios. Não houve auditoria completa dos estágios de build nesta etapa. Evidências: [containers-etapa4-validacao.json](containers-etapa4-validacao.json).
- Compose 5.5.1 instalado via Homebrew. O build usou o builder clássico disponível; recursos exclusivos de BuildKit não são usados pelos Dockerfiles atuais. Testes locais não substituem a CI remota ou a configuração do ingress público.
- README atualizado com configuração e comandos reproduzíveis. `git diff --check` e `docker compose config --quiet` passaram. A inclusão do teste Compose no workflow será tratada na etapa 5.

## Checkpoint — etapa 5 validada localmente; execução remota pendente

- Etapa 4 registrada no commit `3ed6523`, sem push.
- Inspecionada a execução real da main [34150483105](https://github.com/mati23/my-portfolio-page/actions/runs/34150483105): auditorias e API passaram; navegador teve 37 sucessos e cinco falhas (fallback, ciclo WebGL desktop/mobile e cores desktop/mobile). Logs lidos na sessão autenticada do GitHub.
- Reproduzidas falhas em Linux com Playwright 1.63.0. O teste de fallback reativava o 3D antes do reload; agora sai da página antes de mudar a preferência. O teste do ciclo de vida usa uma área landscape menor e a CI roda um worker, preservando cena real, três ciclos, resize e verificações de contexto/callback sem pular testes ou ampliar tolerâncias. Os testes não estabelecem um benchmark de FPS.
- Quantização de imagens gerava paletas diferentes por navegador/plataforma (por exemplo, album 2021). Cores aprovadas do baseline foram incorporadas ao conteúdo anual e validadas como hex; testes continuam usando o baseline independente original. Removidos extrator dinâmico e quatro dependências Vibrant. Não houve regeneração do baseline para fazer testes passarem.
- ESLint e plugin oficial de hooks adicionados, com rules-of-hooks/exhaustive-deps como erros. Nenhuma supressão de regra. Lint e quatro testes unitários passaram.
- Workflow inclui integração Compose, artifacts de regressão mesmo em falha (sete dias), cleanup do container de teste e cancelamento de execuções obsoletas. Dispara em PR, main e manual, evitando duplicação push/PR; timeout de 35 minutos. Artifact action fixada por SHA; resultados de scanners de segredos não são enviados como artifacts.
- Dependabot configurado para npm/NuGet/Docker/Actions, semanal, grupos pequenos minor/patch e limites de PR, sem automerge; só entrará em operação após merge na branch padrão. actionlint, parse do YAML e diff --check passaram.
- Imagem atualizada passou em 42 testes Linux e 42 Chrome macOS, ambos desktop/mobile. Linux local é arm64; a reprodução não é idêntica ao runner hospedado x64. npm completo/produção e Trivy nos estágios de build e produção do front-end sem achados. Evidências em [ci-etapa5-validacao.json](ci-etapa5-validacao.json).
- CI remota destas alterações **ainda não executada**: não houve autorização de push nesta etapa. Não marcar a etapa 5 como totalmente concluída nem iniciar o fechamento final baseado apenas nos testes locais.

**Próximo checkpoint:** após autorização de commit/push e abertura de PR (ou outro disparo disponível), observar a nova CI e corrigir eventual diferença do runner. Com CI verde, seguir para etapa 6 — documentação e fechamento. Não há tarefa agendada nem monitor em segundo plano.
