import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"

import BookReviewsComponent from "./components/BookReviewsComponent"
import BookReviewComponent from "./components/BookReviewComponent"
import PortfolioComponent from "./components/PortfolioComponent"
import MyTopComponent from "./components/MyTopComponent"
import HomeComponent from "./components/HomeComponent"

import "./index.css"

function App() {

	return (
		<div className="App">
			<div className="router-container">
				<BrowserRouter>
					<Routes>
						<Route exact path="/" element={<HomeComponent />} />
						<Route path="myfavourites" element={<MyTopComponent />} />
						<Route path="myportfolio" element={<PortfolioComponent />} />
						<Route path="bookreviews" element={<BookReviewsComponent />} />
						<Route path="bookreviews/:bookId" element={<BookReviewComponent />} />
					</Routes>
				</BrowserRouter>
			</div>
		</div>
	)
}

export default App
