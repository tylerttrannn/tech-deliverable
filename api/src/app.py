from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import AsyncIterator, List

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age

@app.get("/quotes")
async def retrieve_quotes(maxAge: str) -> List[Quote]:
    """
    Retrives a list of quotes given a maxAge paramater 
    filtering via the week, month, year or all quotes
    included 
    """ 

    if maxAge == "lastWeek":
        cutoff = now - timedelta(weeks = 1 )

    elif maxAge == "month":
        cutoff = now - timedelta(days = 30)

    elif maxAge == "year":
        cutoff = now - timedelta(days = 365)
    
    else:
        cutoff = None 
    
    filteredQuotes = []
    now = datetime.now()

    if "quotes" in database: 
        for quote in database["quotes"]:
            quote_time = datetime.strptime(quote["time"], "%Y-%m-%dT%H:%M:%S")

            if quote_time >= cutoff or cutoff is None :
                filteredQuotes.append(quote)

    return filteredQuotes 


