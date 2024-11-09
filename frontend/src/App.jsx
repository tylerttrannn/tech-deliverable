import "./App.css";
import Quote from "./Quote";
import React, { useState, useEffect } from 'react';


function App() {
	const [quotes, setQuotes] = useState([]);
	const [filter, setFilter] = useState("");

	useEffect(() => {
		fetchQuotes()
	}, [filter]);

	async function fetchQuotes(){
		try {
			console.log("trying to fetch"); 
			const response = await fetch(`/api/quotes?maxAge=${filter}`); 
			const quotes = await response.json(); 
			console.log("quotes"); 
			setQuotes(quotes);
		} 
		catch (error){
			console.log("There was an issue with fetching the quotes", error); 
		}
	}


	
	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<div className = "header">
				<h1>Hack at UCI Tech Deliverable</h1>
				<h2>Submit a quote</h2>
				<div>
					<button onClick={() => setFilter("lastWeek")}>This Week</button>
					<button onClick={() => setFilter("month")}>Month</button>
					<button onClick={() => setFilter("year")}>Year</button>
					<button onClick={() => setFilter("")}>All</button>
				</div>

			</div>
		
			{/* TODO: implement custom form submission logic to not refresh the page */}
			<div className = "quoteForm"> 
				<form action="/api/quote" method="post">
					<label htmlFor="input-name">Name</label>
					<input type="text" name="name" id="input-name" required />
					<label htmlFor="input-message">Quote</label>
					<input type="text" name="message" id="input-message" required />
					<button type="submit">Submit</button>
				</form>
			</div>

			<div className = "previousQuotes">
				<h2>Previous Quotes</h2>
				<div className="messages">		
					{quotes.map((quote, index) => (
						<Quote key={index} name={quote.user} message={quote.message} />
					))}
				</div>
			</div>

		</div>
	);
}

export default App;
