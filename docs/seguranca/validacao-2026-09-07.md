# Resolução do ponto 3 — segurança

Implementação na branch `codex/plano-modernizacao`, em 07/09/2026. O [plano original](../planejamento/modernizacao.md) permanece como registro do diagnóstico anterior.

## Resultado

| Verificação | Resultado |
| --- | --- |
| npm, árvore completa, incluindo desenvolvimento | 0 vulnerabilidades; antes eram 30 dependências afetadas |
| npm, dependências de produção | 0 vulnerabilidades |
| NuGet direto/transitivo | 0 vulnerabilidades; restore com auditoria obrigatória |
| Trivy, fontes com dependências de desenvolvimento | 0 vulnerabilidades, segredos ou erros de configuração reportados |
| Trivy, imagem de build do front-end | 0 vulnerabilidades |
| Trivy, imagem de produção do front-end | 0 vulnerabilidades |
| Trivy, imagem de build do back-end | 0 vulnerabilidades |
| Trivy, imagem de produção do back-end | 0 vulnerabilidades |
| Gitleaks, histórico completo (36 commits) | 0 segredos detectados |
| Playwright, imagem de produção | 16 testes passaram; nenhum ignorado |
| API, containers Production e Development | Contrato, health, CORS, Swagger e isolamento de métricas passaram |
| Workflow | Validado com actionlint |

Não há supressões de CVEs, `ignore-unfixed`, exclusões por severidade ou overrides transitivos. O script falha inclusive para achados baixos e para falhas da auditoria NuGet. A exclusão de diretórios gerados/locais na varredura de fontes não exclui dependências do lockfile nem das imagens: ambas são auditadas separadamente. Os binários antigos e dados de métricas foram retirados do índice Git, preservados localmente e excluídos dos contextos Docker.

Esses resultados dizem respeito às vulnerabilidades **conhecidas nas bases consultadas nesta data** e aos artefatos verificados. Não constituem garantia de ausência de falhas ainda desconhecidas. Não foi feito deploy externo; os testes de containers foram executados em Linux arm64 e os testes de navegador em Chrome no macOS arm64. A configuração de CI executa a mesma verificação no runner Linux, mas não foi disparada remotamente nesta entrega.

## Correções realizadas

- **Toolchain:** Node 24.20.0, npm 11.19.1, Vite 8.2.2/plugin React 6.1.1, PostCSS e Autoprefixer corrigidos. Removidas duplicações do manifesto, instalação forçada e Vite global. `npm ci` e `npm ls --all` passaram sem conflitos de peers. Os targets de compilação do Vite 4 foram mantidos explicitamente.
- **UI:** React/DOM 18.3.1, Router 7.18.3, Markdown 10.1.0, Tailwind 3.4.19. Three.js permaneceu em 0.150.1, sem achado na auditoria, evitando uma migração visual desnecessária. Import de Markdown usa API pública; HTML cru continua desabilitado pelo renderer padrão.
- **Extrator:** `react-color-extractor` e sua árvore legada foram removidos. O substituto usa `@vibrant/core`, `image-browser`, `quantizer-mmcq` e `generator-default` 4.0.4, preservando extração dinâmica, algoritmo MMCQ, limite de 64 cores, filtro e transparência. Evita carregar os parsers Node/Jimp e o peer incompatível. Implementação baseada na [composição oficial do Vibrant](https://github.com/Vibrant-Colors/node-vibrant). A comparação dos três anos preserva texto e paleta; tolerância de até 2 unidades RGB cobre variação de decodificação Canvas/GPU entre execuções, com alpha exato.
- **API:** .NET 10.0.11/SDK 10.0.400; SwaggerGen e SwaggerUI 10.2.3. Removido OpenAPI 8 e o metapacote Swashbuckle: ele adicionava um gerador de documentos de build desnecessário que embutia Microsoft.OpenApi 2.0.0 vulnerável. Swagger em desenvolvimento e `/weatherforecast` foram preservados, sem substituir o contrato existente.
- **Imagens:** NGINX sem root serve `dist` na porta 4173, mantendo rotas profundas e refresh. A imagem .NET foi trocada por Alpine com ICU/timezone e patches de sistema. Imagens de build também foram corrigidas: npm atualizado, bibliotecas Linux atualizadas e PowerShell não utilizado removido do SDK. Bases fixadas por digest, com auditoria dos artefatos finais após aplicar patches Alpine.
- **Exposição:** desenvolvimento Vite escuta loopback por padrão. Métricas usam porta interna 9464 em produção; a porta pública rejeita `/metrics`, mesmo com Host forjado. Acesso local de desenvolvimento continua permitido. Adicionados CSP, nosniff, política de referrer e bloqueio de framing no site; os recursos externos existentes continuam permitidos. Health checks reais verificam os dois containers.
- **Reprodutibilidade:** lock NuGet, auditoria no restore e script `scripts/check-security.sh`, com pipeline de push/PR fixando actions por commit. README atualizado com portas, versões e execução. Corrigido caminho de fonte inexistente identificado nos testes, usando a mesma fonte já fornecida pelo projeto.

## Preservação de comportamento

Os testes verificam home com WebGL no desktop e fallback no mobile, navegação para resenhas, favoritos de 2019/2020/2021 com os mesmos textos/cores, quatro resenhas com acesso direto e reload, imagens carregadas, portfólio e ausência de erros JavaScript/CSP. Fixtures de favoritos foram capturadas da revisão original `e07c0ff` em cópia temporária, não da implementação nova.

Nos testes da API, cada modo executa a imagem real: cinco previsões com os mesmos campos/tipos e conversão de temperatura, datas consecutivas, CORS permitido/rejeitado, Swagger somente em desenvolvimento, health check e coleta interna Prometheus. O teste também tenta acessar métricas pela porta pública adulterando Host.

## Evidências e repetição

- [Resumo, versões e hashes](resumo-2026-09-07.json).
- [npm completo](npm-2026-09-07.json), [npm produção](npm-production-2026-09-07.json), [NuGet](nuget-2026-09-07.json).
- Auditoria anterior: [30 dependências afetadas](../planejamento/npm-audit-2026-09-07.json).
- Comandos de repetição e pré-requisitos: [README](../../README.md).

Os JSONs completos do Trivy e logs são gerados novamente por `bash scripts/check-security.sh` em `security-reports/`; não é necessário versionar inventários extensos de pacotes do sistema. O resumo registra os IDs exatos das quatro imagens aprovadas. Novos advisories ou atualizações de imagens podem mudar o resultado e devem bloquear a próxima entrega até correção.
