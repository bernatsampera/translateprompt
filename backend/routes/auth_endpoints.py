from fastapi import APIRouter, Depends
from supertokens_python import InputAppInfo, SupertokensConfig, init

# from supertokens_python.recipe.usermetadata.syncio import get_user_metadata
from supertokens_python.recipe import emailpassword, session
from supertokens_python.recipe.emailpassword.interfaces import (
    SignUpPostOkResult,
)
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.usermetadata.asyncio import (
    get_user_metadata,
    update_user_metadata,
)

from config import config

router = APIRouter(prefix="/auth", tags=["auth"])


def apis_override(original_implementation: emailpassword.interfaces.APIInterface):
    # Get a reference to the original sign_up_post
    original_sign_up_post = original_implementation.sign_up_post

    # Use *args and **kwargs to be compatible with any SDK version
    async def sign_up_post(*args, **kwargs):
        # 1. Call the original implementation, passing through all arguments
        #    that were given to us. This is the key part.
        response = await original_sign_up_post(*args, **kwargs)

        # 2. Check if the sign up was successful
        if isinstance(response, SignUpPostOkResult):
            # The user was created successfully
            user_id = response.user.id

            # 3. Extract form_fields from the arguments. It is always the
            #    first positional argument (at index 0).
            form_fields = args[0]

            username = None
            for field in form_fields:
                if field.id == "username":
                    username = field.value
                    break

            if username is not None:
                # 4. Save the username in the user's metadata
                await update_user_metadata(user_id, {"username": username})

        # 5. Return the original response
        return response

    # Replace the original implementation with our overridden one
    original_implementation.sign_up_post = sign_up_post
    return original_implementation


init(
    app_info=InputAppInfo(
        app_name="TranslatePrompt",
        api_domain=config.BACKEND_URL,  # FastAPI domain
        website_domain=config.FRONTEND_URL,  # React domain
    ),
    supertokens_config=SupertokensConfig(
        connection_uri=config.SUPER_TOKENS_CONNECTION_URI  # your core instance URL
    ),
    recipe_list=[
        emailpassword.init(
            sign_up_feature=emailpassword.InputSignUpFeature(
                form_fields=[emailpassword.InputFormField(id="username")]
            ),
            override=emailpassword.InputOverrideConfig(apis=apis_override),
        ),
        session.init(),  # session management
    ],
    framework="fastapi",
)


@router.get("/private")
async def private_route(
    session_: SessionContainer = Depends(verify_session()),
):
    return {"message": "Hello, authenticated user!"}


@router.get("/user")
async def get_user_info(session: SessionContainer = Depends(verify_session())):
    user_id = session.get_user_id()
    metadata_result = await get_user_metadata(user_id)

    return {"user_id": user_id, "metadata": metadata_result.metadata}
