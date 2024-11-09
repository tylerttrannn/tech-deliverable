import './Quote.css'

function Quote({ name, message }) {
    return (
      <div className="QuoteContainer">
        <div className = "quote">
          <h1>{message}</h1>
        </div>
      </div>
    );
  }
  
  export default Quote;
  