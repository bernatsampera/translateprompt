from fastapi import APIRouter, Depends
from supertokens_python import InputAppInfo, SupertokensConfig, init

# from supertokens_python.recipe.usermetadata.syncio import get_user_metadata
from supertokens_python.recipe import emailpassword, session, thirdparty
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.thirdparty import (
    ProviderClientConfig,
    ProviderConfig,
    ProviderInput,
    SignInAndUpFeature,
)

from config import config

router = APIRouter(prefix="/auth", tags=["auth"])


print("GOOGLE_CLIENT_ID", config.GOOGLE_CLIENT_ID)
init(
    app_info=InputAppInfo(
        app_name="TranslatePrompt",
        api_domain=config.BACKEND_URL,  # FastAPI domain
        website_domain=config.FRONTEND_URL,  # React domain
        api_base_path="/auth",
        website_base_path="/auth",
    ),
    supertokens_config=SupertokensConfig(
        connection_uri=config.SUPER_TOKENS_CONNECTION_URI  # your core instance URL
    ),
    recipe_list=[
        session.init(),
        emailpassword.init(),
        thirdparty.init(
            sign_in_and_up_feature=SignInAndUpFeature(
                providers=[
                    ProviderInput(
                        config=ProviderConfig(
                            third_party_id="google",
                            clients=[
                                ProviderClientConfig(
                                    client_id=config.GOOGLE_CLIENT_ID,
                                    client_secret=config.GOOGLE_CLIENT_SECRET,
                                ),
                            ],
                        ),
                    ),
                ]
            )
        ),
    ],
    framework="fastapi",
)

from supertokens_python.asyncio import get_user


@router.get("/private")
async def private_route(
    session_: SessionContainer = Depends(verify_session()),
):
    return {"message": "Hello, authenticated user!"}


@router.get("/user")
async def get_user_info(session: SessionContainer = Depends(verify_session())):
    user_id = session.get_user_id()
    user_info = await get_user(user_id)
    email = user_info.emails[0]

    return {"user_id": user_id, "email": email}
