import React, { useEffect, useState } from "react";
import './book-review-thumbnail-component.css'
import '../../resources/fonts/Bebas_Neue/BebasNeue-Regular.ttf'


const BookReviewThumbnailComponent = ({
    bookFolderName: newBookTitle = "BookTitle",    
  }) => {
    const [bookFolderName, setBookFolderName] = useState(newBookTitle)
    const [bookTitle, setBookTitlke] = useState("Book Title")
    const [bookPublisher, setBookPublisher] = useState("Book Publisher")
    const [bookAuthors, setBookAuthors] = useState([])    
    const [bookHQImage, setBookHQImage] = useState("")


    return (
    <div className="book-review-thumbnail-container">
        
            <div className="book-container-thumbnail">
                <div className="book-picture-thumbnail">
                    <img src={ process.env.PUBLIC_URL + "/resources/books/"+ bookFolderName +"/thumbnail.jpg"} className="book-picture" ></img>
                </div>
                <div className="book-title-container">
                    <a className="book-title white-text" href="bookreviews/1">
                        {bookTitle}
                    </a>                   
                    
                    <div className="author-name white-text">
                        {bookAuthors.join(",")}
                    </div>
                    <div className="publisher-name white-text">
                        {bookPublisher}
                    </div>
                    
                </div>
            </div>        
    </div>);
};

export default BookReviewThumbnailComponent;
