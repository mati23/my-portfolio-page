# Portfólio

SPA React/Vite com resenhas, favoritos e experiência profissional. A API ASP.NET Core é opcional e mantém o endpoint `/weatherforecast`.

## Desenvolvimento

Use Node **24.20.0**, npm **11.19.1** e, para a API, SDK .NET **10.0.400**. `.nvmrc` e `global.json` registram as versões.

```sh
nvm install
nvm use
npm install --global npm@11.19.1
npm --prefix frontend ci
npm --prefix frontend run dev
```

Front-end: `http://127.0.0.1:8000`. O servidor de desenvolvimento escuta somente loopback; para acesso deliberado por outro dispositivo use `npm --prefix frontend run dev -- --host 0.0.0.0` em rede confiável.

```sh
dotnet restore backend/backend.csproj --locked-mode
dotnet run --project backend --launch-profile http
```

API: `http://localhost:5126/weatherforecast`; Swagger disponível em `/swagger` apenas em desenvolvimento. A instalação npm não usa `--force` nem `--legacy-peer-deps`.

## Produção local com Docker

```sh
docker compose up --build -d
# Opcional: incluir a API
docker compose --profile backend up --build -d
```

Site: `http://localhost:4173`. NGINX serve apenas o build estático, com HTML e metadados por rota e resposta HTTP 404 para endereços desconhecidos. Vite preview é exclusivo para inspeção local (`npm --prefix frontend run preview`), não é usado em produção. HTTPS deve ser terminado no ingress/proxy da hospedagem.

A API opcional publica somente `127.0.0.1:5126`. Em produção, `/metrics` está disponível na porta **9464 da rede interna**, por exemplo `http://backend:9464/metrics` para um Prometheus na mesma rede. Não publique essa porta no host/ingress. A porta pública retorna 404 para métricas, inclusive quando o cabeçalho Host é adulterado. Em desenvolvimento, também é permitido coletar métricas pela porta local da API, em conexões loopback.

Ambos os containers possuem health check e executam sem root. As imagens base são fixadas por digest; os estágios com Alpine aplicam atualizações de segurança durante o build. Os relatórios identificam a imagem final exata, pois os pacotes do sistema podem receber novos patches.

## Verificação

Com Docker, Trivy **0.74.0**, Gitleaks **8.30.1** e os runtimes acima no PATH:

```sh
bash scripts/check-security.sh
python3 scripts/test-backend.py
docker run --rm -d --name portfolio-web-test -p 127.0.0.1:4173:4173 portfolio-frontend:security
cd frontend
npx playwright install chromium
npm run test:unit
npm run test:e2e
docker stop portfolio-web-test
```

Libere a porta 4173 antes desse teste se o Compose estiver ativo. Para usar Chrome já instalado: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`. Os testes usam a imagem de produção, verificando desktop/mobile, navegação, cores, resenhas e CSP. Os testes da API criam e removem seus próprios containers.

O script de segurança falha para qualquer severidade encontrada, sem `ignore-unfixed`, supressões de CVEs ou overrides de dependências. Audita npm completo/produção, NuGet direto/transitivo, fontes, imagens de build/runtime e histórico Git. Gera relatórios em `security-reports/` (não versionados). A mesma sequência está em `.github/workflows/security.yml` para push e pull request.

Binários antigos, `obj` e dados locais do Prometheus deixaram de ser versionados e não entram no contexto de build. Os arquivos locais existentes foram preservados; nada foi reescrito no histórico Git.

Consulte [o relatório de segurança](docs/seguranca/validacao-2026-09-07.md) e [o plano original](docs/planejamento/modernizacao.md).

As correções de front-end, configuração opcional de domínio e regeneração dos assets estão documentadas em [Evolução do front-end](docs/frontend-evolution.md).

O ponto 5 está sendo executado em etapas no [roteiro de backend, containers e repositório](docs/planejamento/backend-containers-repositorio.md). Builds Docker recebem o domínio por `VITE_SITE_URL` como argumento de build; arquivos `.env` locais não entram nas imagens.

### HTTP, HTTPS e CORS da API

No container, HTTP permanece interno e o ingress é responsável por TLS e pela política de acesso público. `HttpsRedirection:Enabled` é `false` por padrão; não há interpretação automática de `X-Forwarded-*`. O profile `http` continua em 5126. Para HTTPS direto no desenvolvimento, configure/confie no certificado de desenvolvimento .NET e execute `dotnet run --project backend --launch-profile https`: esse profile escuta em 7139 e habilita o redirecionamento para essa porta. `/health` e a coleta interna de métricas permanecem em HTTP. Habilitar somente o redirecionamento não cria um listener HTTPS nem instala um certificado.

`Cors:AllowedOrigins` é uma string de origens separadas por ponto e vírgula, sem caminhos, barra final ou curingas. Em produção os defaults anteriores (`http://localhost:8000` e `https://localhost:8000`) foram preservados; Development também aceita `http://127.0.0.1:8000`, `http://localhost:4173` e `http://127.0.0.1:4173`. Para substituir toda a lista, configure `Cors__AllowedOrigins` no processo/container; uma string vazia desabilita a permissão cross-origin. O Compose ainda não encaminha essa variável automaticamente: use configuração de ambiente do serviço/override ou `docker run -e`. CORS não autentica chamadas à API.

A opção de TLS no ingress segue a [orientação oficial do ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-10.0). Caso um deploy futuro precise consumir forwarded headers, os proxies confiáveis devem ser configurados explicitamente nessa entrega.

### Organização e tratamento de erros

O endpoint demonstrativo e seu modelo ficam em `backend/Features/Weather`; `Program.cs` compõe serviços e middleware. Exceções não tratadas retornam HTTP 500 com `application/problem+json`, título genérico e `traceId`, sem mensagem interna ou stack trace, inclusive em Development. Os logs de console são JSON com escopos e mantêm a exceção original; não devem ser expostos publicamente. Respostas normais, 404 e o contrato de forecast permanecem inalterados.

Teste de falhas (Kestrel real em porta efêmera, sem pacotes adicionais):

```sh
dotnet restore tests/Backend.Errors/Backend.Errors.csproj --locked-mode
dotnet run --no-restore --project tests/Backend.Errors/Backend.Errors.csproj
```

A rota de falha existe somente nesse executável de teste, fora do contexto Docker da API. O teste reutiliza o middleware do produto e verifica resposta genérica, logs, rastreamento e recuperação após exceções. Usa o [tratamento de exceções nativo do ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling?view=aspnetcore-10.0).

### Instâncias isoladas com Compose

As portas padrão continuam sendo 4173 (site) e 5126 (API opcional). `FRONTEND_PORT` e `BACKEND_PORT` alteram somente a porta publicada no host; a API permanece vinculada a `127.0.0.1`. `FRONTEND_BIND_ADDRESS` tem default `0.0.0.0`; use `127.0.0.1` para restringir o site ao computador local. Não existe mais nome fixo de container: o nome do projeto isola instâncias.

```sh
FRONTEND_BIND_ADDRESS=127.0.0.1 FRONTEND_PORT=4174 BACKEND_PORT=5127 \
  docker compose -p portfolio-review --profile backend up --build -d --wait
# Remove somente essa instância; não apaga imagens nem dados locais.
docker compose -p portfolio-review --profile backend down
```

As métricas são acessadas por `http://backend:9464/metrics` na rede do projeto; a porta 9464 não é publicada no host. O NGINX comprime HTML, JavaScript, CSS e outros formatos textuais negociados com o cliente, enviando `Vary: Accept-Encoding`. Imagens WebP e fontes WOFF2 não são recomprimidas.

`python3 scripts/test-compose.py` constrói e testa projetos temporários com portas efêmeras: front-end sozinho, profile backend e duas instâncias simultâneas, incluindo health checks, rotas, headers, gzip e rede de métricas. Requer Docker com plugin Compose e remove somente os projetos de teste ao terminar. `COMPOSE_TEST_REPORT=/caminho/relatorio.json` grava os resultados e IDs das imagens. Os testes não substituem uma avaliação de TLS no ingress real.

Referências: [isolamento por projeto no Compose](https://docs.docker.com/compose/how-tos/project-name/) e [compressão no NGINX](https://nginx.org/en/docs/http/ngx_http_gzip_module.html).

### CI e atualizações de dependências

O workflow executa em PRs, push na `main` e acionamento manual. A concorrência cancela execuções antigas do mesmo PR/ref; branches sem PR não disparam uma execução redundante. Inclui auditorias, lint das regras de hooks/dependências de efeitos, testes unitários, testes de erro da API, integração Compose e navegador. Relatórios de navegador e auditorias de pacotes/imagens ficam em artifacts por sete dias, inclusive em falhas; relatórios de scanner de segredos não são publicados como artifacts.

`npm --prefix frontend run lint` executa o lint local. Na CI os testes de navegador usam um worker para evitar concorrência entre cenas WebGL renderizadas por software. O teste de ciclo de vida usa uma área menor, mantendo a cena real e as verificações de callbacks, contextos, resize e desmontagem; os demais testes desktop preservam o viewport padrão.

As cores dos favoritos agora são conteúdo explícito (`color` hexadecimal no JSON anual), preservando a paleta aprovada registrada antes da modernização. Não são recalculadas no navegador: a quantização das mesmas imagens apresentou diferenças entre Linux e macOS. Ao adicionar uma categoria/ano, informe uma cor válida; o build e o carregamento validam esse campo. A dependência de extração de cores deixou de ser necessária. Os testes continuam usando o baseline independente existente.

Dependabot está configurado para verificações semanais de npm, NuGet, Docker e GitHub Actions, com limite de dois PRs por entrada. Grupos pequenos reúnem minor/patch de pacotes relacionados; majors ficam separadas, sem automerge. SDK, `.nvmrc`, versões fixadas em scripts e digests precisam continuar alinhados ao revisar cada PR. A configuração entra em operação após merge na branch padrão e não substitui as auditorias da CI nem habilita automaticamente todas as opções de alertas de segurança do repositório.
