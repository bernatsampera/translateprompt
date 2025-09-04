from fastapi import APIRouter, Depends
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session

from database.user_operations import UserOperations

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/details")
async def get_user_details(session: SessionContainer = Depends(verify_session())):
    user_id = session.get_user_id()
    user_ops = UserOperations()
    user = user_ops.get_user(user_id)

    return user
