import React, { useEffect, useState } from "react";
import './book-review-thumbnail-component.css'
import '../../resources/fonts/Bebas_Neue/BebasNeue-Regular.ttf'


const BookReviewThumbnailComponent = ({
    bookFolderName: newBookTitle = "BookTitle",    
  }) => {
    const [bookFolderName, setBookFolderName] = useState(newBookTitle)
    const [bookTitle, setBookTitle] = useState("Book Title")
    const [bookPublisher, setBookPublisher] = useState("Book Publisher")
    const [bookAuthors, setBookAuthors] = useState([])    
    const [bookHQImage, setBookHQImage] = useState("")
    const [bookId,setBookId] = useState("o-livro-da-economia")
    
    function getJsonFileForEntityAndYear() {
        fetch(
          "/resources/books/"
            .concat(bookFolderName)
            .concat("/review.json")
        )
          .then((r) => {
            return r.json();
          })
          .then((data) => {
            console.log(data["bookName"]);
            setBookTitle(data["bookName"]);
            setBookPublisher(data["bookPublisher"]);
            setBookAuthors(data["bookAuthors"])
          });
      }

    useEffect(()=>{
        getJsonFileForEntityAndYear()
    },[]);

    return (
    <div className="book-review-thumbnail-container">
        
            <div className="book-container-thumbnail">
                <div className="book-picture-thumbnail">
                    <img src={ process.env.PUBLIC_URL + "/resources/books/"+ bookFolderName +"/thumbnail.jpg"} className="book-picture" ></img>
                </div>
                <div className="book-title-container">
                    <a className="book-title white-text" href={"bookreviews/"+bookFolderName}>
                        {bookTitle}
                    </a>                   
                    
                    <div className="author-name white-text">
                        {bookAuthors}
                    </div>
                    <div className="publisher-name white-text">
                        {bookPublisher}
                    </div>
                    
                </div>
            </div>        
    </div>);
};

export default BookReviewThumbnailComponent;
