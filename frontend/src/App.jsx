import "./App.css";
import Quote from "./Quote";
import React, { useState, useEffect } from 'react';


function App() {
	const [quotes, setQuotes] = useState([]);
	const [filter, setFilter] = useState("");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
  

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

	async function submitForm(event){
		event.preventDefault(); 
		try {
			const response = await fetch('/api/quote', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					name: name,
					message: message,
				}),
			});

			if (response.ok) {
				console.log("Quote submitted successfully");
				fetchQuotes();
			} else {
				console.log("Error submitting the quote");
			}
		} 
		catch (error){
			console.log("There was an issue with submiting the quote", error); 
		}
	}

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<div className = "header">
				<img src= "../assets/quotebook.png"></img>
				<h1>Hack at UCI Tech Deliverable</h1>
				<h2>Submit a quote</h2>
				<div className = "filterButtons">
					<button onClick={() => setFilter("lastWeek")}>This Week</button>
					<button onClick={() => setFilter("month")}>Month</button>
					<button onClick={() => setFilter("year")}>Year</button>
					<button onClick={() => setFilter("")}>All</button>
				</div>
			</div>
		
			<div className = "quoteForm"> 
				<form onSubmit = {submitForm}>
					<label htmlFor="input-name">Name</label>
					<input type="text" name="name" id="input-name" value={name} onChange={(e) => setName(e.target.value)} required />
					<label htmlFor="input-message">Quote</label>
					<input type="text" name="message" id="input-message" value={message} onChange={(e) => setMessage(e.target.value)} required />
					<button type="submit">Submit</button>
				</form>
			</div>

			<div className = "previousQuotes">
				<h2>Previous Quotes</h2>
				<div className="messages">		
					{quotes.map((quote, index) => (
						<Quote key={index} name={quote.name} message={quote.message} date={new Date(quote.time).toLocaleString()} />
					))}
				</div>
			</div>

		</div>
	);
}

export default App;
