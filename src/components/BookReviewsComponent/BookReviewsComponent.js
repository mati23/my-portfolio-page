import React, { useEffect, useState } from "react";
import './book-reviews-component.css'
import '../../resources/fonts/Bebas_Neue/BebasNeue-Regular.ttf'


function BookReviewsComponent() {
    return (
    <div className="book-reviews-component">
        <div className="book-grid">
            <div className="book-container-thumbnail">
                <div className="book-picture-thumbnail">
                    <img className="book-picture" src="https://m.media-amazon.com/images/I/913Fkar1-VL.jpg" ></img>
                </div>
                <div className="book-title-container">
                    <div className="book-title white-text">
                        O Livro da Economia
                    </div>
                    <div className="author-name white-text">
                        Vários Autores
                    </div>
                    <div className="publisher-name white-text">
                        Globo Livros
                    </div>
                    
                </div>
            </div>
            <div className="book-container-thumbnail">
                Book
            </div>
            <div className="book-container-thumbnail">
                Book
            </div>
        </div>
    </div>);
};

export default BookReviewsComponent;
