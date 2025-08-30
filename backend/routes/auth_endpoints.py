from fastapi import APIRouter, Depends
from supertokens_python import InputAppInfo, SupertokensConfig, init
from supertokens_python.recipe import emailpassword, session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session

router = APIRouter(prefix="/auth", tags=["auth"])


init(
    app_info=InputAppInfo(
        app_name="TranslatePrompt",
        api_domain="http://localhost:8008",  # FastAPI domain
        website_domain="http://localhost:5178",  # React domain
    ),
    supertokens_config=SupertokensConfig(
        connection_uri="https://supertokens-vssocosgc4ckcw4goks4wg4c.samperalabs.com"  # your core instance URL
    ),
    recipe_list=[
        emailpassword.init(),  # for login/signup with email & password
        session.init(),  # session management
    ],
    framework="fastapi",
)


@router.get("/private")
async def private_route(
    session_: SessionContainer = Depends(verify_session()),
):
    return {"message": "Hello, authenticated user!"}
