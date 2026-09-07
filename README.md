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
