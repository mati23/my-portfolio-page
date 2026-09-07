# Correções e evolução do front-end

Implementação do ponto 4 do plano, validada em 07/09/2026 na branch `codex/plano-modernizacao`. O plano original permanece como registro do diagnóstico. A base da comparação é o commit `30fad20`.

## Resultado por item

1. **Cena 3D:** contêiner React com ref, um único requestAnimationFrame, delta limitado, quatro curvas sem acesso fora dos arrays, resize e limites de framebuffer (1920×1080, pixel ratio até 1,5). A desmontagem cancela callbacks, remove listeners e descarta geometrias, materiais, texturas, passes, composer e renderer. A animação pausa em abas ocultas. Movimento reduzido, telas pequenas e ausência/perda de WebGL usam imagem estática; Three.js é carregado sob demanda. A textura é gerada localmente, sem dependência de host externo.
2. **Carregamento:** resenhas acompanham a mudança de slug; respostas antigas não substituem o livro atual. HTTP, JSON e Markdown são validados, com estados de carregamento, erro, nova tentativa e conteúdo inexistente. Requisições sem consumidores são canceladas.
3. **Conteúdo:** catálogo explícito e contratos de dados em `src/content`; hook de consumo separado da apresentação. Favoritos montam somente o ano ativo e compartilham uma requisição por ano, com cache em memória. Validação em execução e no build atende os contratos atuais sem introduzir TypeScript ou biblioteca de estado global.
4. **Rotas:** layout comum com Navbar e links do Router, páginas carregadas sob demanda, recuperação de falha de chunk e página 404. O NGINX serve HTML específico para as rotas conhecidas, permite acesso direto/refresh e retorna HTTP 404 para endereços inexistentes.
5. **Acessibilidade e desempenho:** menu móvel controlado por React, teclado/Escape, foco após navegação, link para pular ao conteúdo, nomes acessíveis, títulos e IDs únicos. Contraste e largura móvel revisados. Imagens de livros responsivas em WebP, fontes WOFF2 com `font-display: swap`, logo próprio e fallback otimizado. Os textos e as cores extraídas dos favoritos continuam cobertos pelos testes de regressão.
6. **SEO e estilos:** título, descrição e tags sociais por página no HTML gerado e na navegação SPA, cartão social próprio e noindex no 404. CSS redundante, imports e estados que copiavam props foram removidos. O corpo das resenhas continua renderizado pelo React; não foi adicionada uma infraestrutura SSR/pré-renderização de conteúdo, pois indexação sem JavaScript não foi definida como requisito.

## Domínio e publicação

O domínio público ainda não foi definido. Nenhum domínio fictício é publicado. Configure `VITE_SITE_URL` com uma origem HTTP(S), sem caminho, quando estiver disponível:

- Build direto: crie `frontend/.env.production` seguindo `frontend/.env.example` e execute `npm --prefix frontend run build`.
- Compose: defina `VITE_SITE_URL` no ambiente antes de `docker compose up --build -d`.
- Docker: passe `--build-arg VITE_SITE_URL=...` ao build do front-end.

Com domínio configurado, o build gera canonical, URLs sociais absolutas e sitemap. Sem ele, omite canonical/og:url estáticos e sitemap; na execução, as URLs usam a origem atual do navegador. As imagens sociais absolutas para crawlers estarão disponíveis após a configuração do domínio e novo build.

## Assets e licenças

O logo e o cartão social SVG são próprios; a textura de fumaça é procedural. Os recursos não dependem mais de Flowbite ou do host externo da textura.

As fontes Zrnic e Robinson foram substituídas por Rajdhani e Playfair Display. A distribuição anterior não trazia uma licença suficiente para confirmar as permissões de redistribuição/conversão dessas duas fontes. Rajdhani, Playfair Display, Bebas Neue e Yanone Kaffeesatz têm suas licenças SIL OFL preservadas em `frontend/src/resources/fonts`. Isso altera intencionalmente a tipografia de títulos e da home. Os demais recursos de conteúdo existentes foram preservados; esta revisão não certifica direitos sobre capas e imagens editoriais de terceiros.

Os derivados já estão versionados e não exigem Python para desenvolvimento/build. Para regenerá-los, execute da raiz, em um ambiente Python com Pillow 12.2.0, fontTools 4.62.1 e Brotli 1.2.0:

```sh
python scripts/optimize-assets.py
```

Os JPEGs dos favoritos permanecem inalterados: diferenças de decodificação após conversão afetavam a quantização da paleta. Somente os dois arquivos PNG com extensão `.jpg` foram convertidos sem perdas. Os originais foram preservados.

## Validação

- 4 testes unitários de contratos, HTTP, compartilhamento/cache, cancelamento e nova tentativa.
- 42 testes Playwright na imagem de produção, em Chrome desktop e móvel: conteúdo/cores, rotas diretas e refresh, falhas/retry, troca de livro, cache, teclado, 404, metadados, CSP e acessibilidade.
- 8 testes adicionais no Vite com React StrictMode: montagem/desmontagem, respostas antigas, cache, fallback e movimento reduzido. Em três ciclos, a home manteve um contexto WebGL e um callback pendente, e retornou a zero de ambos ao sair. Isso verifica liberação observável de recursos; não é uma medição completa de heap ou VRAM do processo.
- Axe sem violações WCAG 2 A/AA e 2.1 AA detectadas nas cinco rotas testadas; nenhuma ultrapassou a largura do viewport. Verificação automatizada não substitui avaliação integral com tecnologias assistivas.
- API validada em Production e Development: health, forecast, CORS, Swagger e isolamento de métricas.
- npm completo/produção, NuGet direto/transitivo, Trivy em fontes e quatro imagens (build/runtime) e Gitleaks no histórico: zero achados nas ferramentas executadas, sem supressões. Novas vulnerabilidades podem ser publicadas após esta análise.

Resultados estruturados: [validacao-2026-09-07.json](frontend/validacao-2026-09-07.json). Os comandos de auditoria e testes estão no README e na CI; os testes unitários foram incluídos no workflow.

### Recursos transferidos

Medição local em Chrome, viewport 1280×800, nova página/contexto por rota, soma de `encodedBodySize` dos recursos até `networkidle`. É uma comparação de bytes observados, não um benchmark de latência ou Core Web Vitals; imagens lazy fora do viewport podem não participar.

| Rota | Antes | Depois | Redução |
| --- | ---: | ---: | ---: |
| Home | 895.357 B | 783.112 B | 12,5% |
| Resenhas | 2.851.329 B | 334.967 B | 88,3% |
| Make it Stick | 5.895.599 B | 501.761 B | 91,5% |
| Favoritos | 6.832.925 B | 4.184.513 B | 38,8% |
| Portfólio | 1.578.938 B | 977.526 B | 38,1% |

O chunk JavaScript inicial tem 188,97 kB (62,77 kB gzip); a cena Three.js fica em chunk separado de 463,46 kB (117,34 kB gzip), solicitado somente quando aplicável.
