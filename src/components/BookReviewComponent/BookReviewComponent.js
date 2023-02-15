import { Form, useLoaderData, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./book-review-component.css";
import { promises as fs } from 'fs';


function BookReviewComponent() {
  const [bookName, setBookName] = useState("Book Name")
  const contact = useLoaderData();
  const params = useParams();
  const [reviewDescriptionHtml, setReviewDescriptionHtml] = useState("");
  
  function  getJsonFileForEntityAndYear() {   
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
        setBookName(data["bookName"])
      });
  }

  useEffect(()=>{
    console.log(params)
    getJsonFileForEntityAndYear();
  })

  function readTextFile(file)
  {
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", file, false);
      rawFile.onreadystatechange = function ()
      {
          if(rawFile.readyState === 4)
          {
              if(rawFile.status === 200 || rawFile.status == 0)
              {
                  var allText = rawFile.responseText.replace(/[\r\n]/gm, '');
                  setReviewDescriptionHtml(allText);
              }
          }
      }
      rawFile.send(null);
  }

  useEffect(()=>{
    readTextFile("/resources/books/"
    .concat(params.bookId)
    .concat("/description.html"));    
  },[]);

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
        <section className="description-review-section" dangerouslySetInnerHTML={{__html: reviewDescriptionHtml}}>
        </section>
      </div>
    </div>
  );
}

export default BookReviewComponent;
