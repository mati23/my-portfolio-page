import { Form, useLoaderData } from "react-router-dom";
import React from "react";
import "./book-review-component.css";

export async function loader({ params }) {
  const book = {
    first: "Your",
    last: "Name",
    avatar: "https://placekitten.com/g/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };
  return book;
}

function BookReviewComponent() {
  const contact = useLoaderData();
  return (
    <div className="book-review-container white-text">
      <div className="book-review-centerized-container">
        <div className="book-review-title">O Livro da Economia</div>
        <div className="book-landscape-picture">
          <img
            className="book-picture"
            src="/resources/books/o-livro-da-economia/my-book.png"
          ></img>
        </div>
        <section>
          <p className="initial-letter">
            O Livro da Economia é um dos muitos livros lançados pela GloboLivros
            da série de obras com foto em diferentes áreas de estudo, como O
            Livro dos Negócios, O Livro da Matemática, entre outros.
          </p>
          <p>
            Em uma primeira vista pensava que os assuntos eram desconexos e que
            tinha a função de ser um livro apenas de consulta. Entretanto, eu
            estava errado. O livro é dividido em blocos de tempo que dividiram a
            história como o Início do Comércio desde 400 a.C. passando por
            períodos como a Revolução Industrial, Guerras e Depressões até
            chegar no período da Economia Contemporânea trazendo conceitos e
            ideias dos economistas da atualidade. Não só uma divisão de tempo,
            também sabemos em cada capítulo qual é o foco de estudo, que pode
            ser dos mais variados como Mercados e Empresas, Macroeconomia,
            Sociedade e Economia entre outros.
          </p>
          <p>
            Um pouco sobre como o livro é produzido, eu digo particularmente que
            foi muito bem escrito e organizado. Os capítulos não são longos, é
            fácil de se entender e as imagens ajudam muito a assimilar alguns
            conceitos como o dilema do prisioneiro. Também é muito interessante
            ver as fotos dos maiores contribuintes para a área de economia junto
            às suas biografias e ver que muitos deles até contribuíram para
            outras áreas como Vilfredo Pareto na engenharia, Max Weber no
            direito e John Von Neuman na Ciência da Computação.
          </p>
          <p>
            Mas para mim, saber esses detalhes históricos não foi o mais
            importante, e sim refletir sobre os fatos ocorridos e os problemas
            que enfrentamos até hoje como o impacto da economia no meio
            ambiente, a desigualdade social e o diferente tratamento (negativo)
            do mercado ao trabalho feminino. É possível ver no texto e nas
            imagens a descrepância de riquezas entre países e a insensibilidade
            de empresas trilionárias a submeter pessoas a um trabalho subhumano
            dos mais pobres simplesmente por não ser um trabalho intelectual.
            Será que é de intenção das empresas (e até nações) mais ricas que os
            pobres sejam sempre mais pobres? Essa é apenas uma das muitas
            reflexões que tive lendo o livro.
          </p>
          <p>
            Também senti falta de alguns aspectos muito importantes na
            atualizade como por exemplo o surgimento das criptomoedas e como
            elas estão mudando a forma do ser humano consumir e investir e os
            impactos positivos e negativos para nossa sociedade.
          </p>
          <p>
            Portanto, esse livro não é foco de nenhum estudo específico de
            economia, mas é a porta de entrada, o ponta-pé inicial para
            descobrir que essa área de estudos é muito mais complexa do que se
            imagina. Recomendo-o a todos que tenham interesse no tema e que
            pessoalmente estou entusiasmado para ler as outras obras da
            coletânea.
          </p>
        </section>
      </div>
    </div>
  );
}

export default BookReviewComponent;