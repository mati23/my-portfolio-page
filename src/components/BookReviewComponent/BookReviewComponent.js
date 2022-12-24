import { Form, useLoaderData, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./book-review-component.css";



function BookReviewComponent() {
  const [bookName, setBookName] = useState("Book Name")
  const contact = useLoaderData();
  const params = useParams();
  const [reviewDescription, setReviewDescription] = useState("")
  
  function getJsonFileForEntityAndYear() {
    console.log("file path is ", "/resources/books/"
    .concat(params.bookId)
    .concat("/review.json"));
    fetch(
      "/resources/books/"
        .concat(params.bookId)
        .concat("/review.json")
    )
      .then((r) => {
        console.log("json requested is: ", r.json);
        return r.json();
      })
      .then((data) => {
        let descriptionString = data["description"]
        setReviewDescription(descriptionString);
        setBookName(data["bookName"])
      });
  }

  useEffect(()=>{
    console.log(params)
    getJsonFileForEntityAndYear();
  })



  return (
    <div className="book-review-container white-text">
      <div className="book-review-centerized-container">
        <div className="book-review-title">{bookName}</div>
        <div className="book-landscape-picture">
          <img
            className="book-picture"
            src={"/resources/books/"+params.bookId+"/my-book.png"}
          ></img>
        </div>
        <section className="description-review-section" dangerouslySetInnerHTML={{__html: reviewDescription}}>
        </section>
      </div>
    </div>
  );
}

export default BookReviewComponent;
