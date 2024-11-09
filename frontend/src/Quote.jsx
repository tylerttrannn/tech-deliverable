import './Quote.css'

function Quote({ name, message, date}) {
    return (
      <div className="QuoteContainer">
        <div className = "quote">
          <h1>{name}</h1>
          <h1>{message}</h1>
          <h1>{date}</h1>
        </div>
      </div>
    );
  }
  
  export default Quote;
  