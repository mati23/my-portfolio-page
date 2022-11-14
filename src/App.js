import logo from './logo.svg';
import React from 'react';
import './App.css';
import './index.css';
import NavbarComponent from './components/NavbarComponent/NavbarComponent.js'
import MyTopComponent from './components/MyTopComponent/MyTopComponent.js'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Root from './routes/root';
import HomeComponent from './components/HomeComponent/HomeComponent';
import BookReviewsComponent from './components/BookReviewsComponent/BookReviewsComponent';
import BookReviewComponent from './components/BookReviewComponent/BookReviewComponent';

const router = createBrowserRouter([

  {
    path: "/",
    element: <HomeComponent/>,    
  },
  {
    path: "myfavourites",
    element: <MyTopComponent/>,
  },
  {
    path: "bookreviews",
    element: <BookReviewsComponent/>,    
  },  
  {
    path: "/bookreviews/:bookId",
    element: <BookReviewComponent/>,
  }
]);

function App() {
  return (
    <div className='App'>
      <NavbarComponent></NavbarComponent>
      <div className='router-container'>      
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
      </div>
    </div>    
  );
}

export default App;
