# Meu Portfólio

Este é um projeto de portfólio construído usando React. Ele fornece uma maneira simples de exibir minhas experiências técnicas.

## Como executar localmente

Para executar este projeto localmente, siga estas etapas:

Certifique-se de ter o Node.js instalado em seu sistema. Você pode baixá-lo em https://nodejs.org.

Clone este repositório para o seu computador:

```bash
git clone https://github.com/mati23/my-portfolio-page.git
```
Navegue até o diretório do projeto:

```bash
cd portfolio-react
```

Instale as dependências do projeto usando o npm:

```bash
npm install
```

Após a conclusão da instalação das dependências, você pode iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

Isso iniciará o servidor de desenvolvimento. Agora você pode visualizar o portfólio localmente em http://localhost:8000.

## Usando Docker

Se você preferir executar o projeto usando o Docker, siga estas etapas:

Certifique-se de ter o Docker instalado em seu sistema. Você pode baixá-lo em https://www.docker.com.

Clone este repositório para o seu computador:

```bash
git clone https://github.com/mati23/my-portfolio-page.git
```

Navegue até o diretório do projeto:
```bash
cd my-portfolio-page
```

Digite o seguinte comando:

```bash
npm run docker-first
```

Ao executar este comando pela primeira vez, cria a imagem Docker, executa o Docker Container, instala as dependências e executa o projeto dentro do Container. Como a criação da imagem e a instalação das dependências só precisa ser feita uma vez, a partir da segunda execução, utilize o seguinte código:

```bash
npm run docker-dev
```

Agora você pode visualizar o portfólio acessando http://localhost:8000 no seu navegador.

Após a parada na execução do código anterior, o Docker Container ainda estará em execução. Para pará-lo utilize o seguinte código:

```bash
npm run docker-stop
```


## Licença

Este projeto está licenciado sob a MIT License.
****

## Objetivos após modificações

- [x] remover 3D da Home em dispositivos móveis

- [x] tornar todas as páginas responsivas

- [x] atualizar libs
