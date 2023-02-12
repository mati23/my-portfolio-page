import React, { useEffect, useState } from "react";
import './book-reviews-component.css'
import '../../resources/fonts/Bebas_Neue/BebasNeue-Regular.ttf'
import { Link } from "react-router-dom";
import BookReviewThumbnailComponent from "../BookReviewThumbnailComponent/BookReviewThumbnailComponent";


function BookReviewsComponent() {
    return (
    <div className="book-reviews-component">
        <div className="book-grid">
        <BookReviewThumbnailComponent bookFolderName="o-livro-da-economia"/>
        <BookReviewThumbnailComponent bookFolderName="make-it-stick"/>
        <BookReviewThumbnailComponent bookFolderName="o-mundo-assombrado-por-demonios"/>
        <BookReviewThumbnailComponent bookFolderName="habitos-atomicos"/>
        </div>
    </div>);
};

export default BookReviewsComponent;
