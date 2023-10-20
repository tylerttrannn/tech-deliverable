from datetime import datetime
from typing import Any

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse

from services.database import JSONDatabase

app = FastAPI()

database: JSONDatabase[list[dict[str, Any]]] = JSONDatabase("data/database.json")


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database when starting API server."""
    if "posts" not in database:
        print("Adding posts entry to database")
        database["posts"] = []


@app.on_event("shutdown")
def on_shutdown() -> None:
    """Close database when stopping API server."""
    database.close()


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now().replace(microsecond=0)
    post = {
        "name": name,
        "message": message,
        "time": now.isoformat(),
    }
    database["posts"].append(post)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age
