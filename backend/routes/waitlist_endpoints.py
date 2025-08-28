from fastapi import APIRouter
from pydantic import BaseModel

from database.connection import create_database_connection
from database.waitlist_operations import WaitlistOperations

router = APIRouter(prefix="/waitlist", tags=["waitlist"])


class WaitlistRequest(BaseModel):
    email: str


@router.post("/add")
def add_to_waitlist(request: WaitlistRequest):
    db_connection = create_database_connection()
    waitlist_operations = WaitlistOperations(db_connection=db_connection)
    waitlist_operations.add_to_waitlist(request.email)
    return {"message": f"Email {request.email} added to the waitlist"}
