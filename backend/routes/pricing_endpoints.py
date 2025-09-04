"""Pricing and subscription webhook endpoints for Lemon Squeezy integration."""

import hashlib
import hmac
import json

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import Response

from config import config
from database.user_operations import UserOperations
from utils.logger import logger

router = APIRouter(prefix="/pricing", tags=["pricing"])


def verify_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verify the webhook signature from Lemon Squeezy.

    Args:
        payload: Raw request body bytes
        signature: X-Signature header value
        secret: Lemon Squeezy signing secret

    Returns:
        True if signature is valid, False otherwise
    """
    if not secret:
        logger.error("Lemon Squeezy signing secret not configured")
        return False

    # Generate expected signature
    expected_signature = hmac.new(secret.encode(), payload, hashlib.sha256).hexdigest()

    # Compare signatures (timing-safe comparison)
    return hmac.compare_digest(signature, expected_signature)


def get_quota_limit_from_variant(variant_id: str) -> int:
    """Get quota limit based on variant ID.

    Args:
        variant_id: Lemon Squeezy variant ID

    Returns:
        Quota limit for the variant
    """
    # These would be your actual variant IDs from Lemon Squeezy
    variant_quotas = {
        # Add your actual variant IDs here when you know them
        # Example:
        # "123456": 500000,  # Pro plan
        # "789012": 2000000,  # Power User plan
    }

    # Default to 500,000 for Pro plan if variant not found
    return variant_quotas.get(variant_id, 500000)


@router.post("/lemonsqueezy-webhook")
async def lemonsqueezy_webhook(request: Request):
    """Handle Lemon Squeezy webhook events."""
    try:
        # Get raw body and signature
        body = await request.body()
        signature = request.headers.get("X-Signature", "")

        print(
            f"config.LEMONSQUEEZY_SIGNING_SECRET: {config.LEMONSQUEEZY_SIGNING_SECRET}"
        )

        # Verify signature
        if not verify_signature(body, signature, config.LEMONSQUEEZY_SIGNING_SECRET):
            logger.warning("Invalid webhook signature")
            raise HTTPException(status_code=401, detail="Invalid signature")

        # Parse JSON payload
        try:
            payload = json.loads(body.decode())
        except json.JSONDecodeError:
            logger.error("Invalid JSON payload")
            raise HTTPException(status_code=400, detail="Invalid JSON")

        # Get event name
        event_name = payload.get("meta", {}).get("event_name")
        if not event_name:
            logger.error("Missing event_name in payload")
            raise HTTPException(status_code=400, detail="Missing event_name")

        logger.info(f"Processing Lemon Squeezy webhook: {event_name}")

        # Initialize user operations
        user_ops = UserOperations()

        # Handle different events
        if event_name == "subscription_created":
            await handle_subscription_created(payload, user_ops)
        elif event_name == "subscription_cancelled":
            await handle_subscription_cancelled(payload, user_ops)
        elif event_name == "subscription_payment_success":
            await handle_subscription_payment_success(payload, user_ops)
        else:
            logger.info(f"Unhandled event type: {event_name}")

        return Response(status_code=200)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


async def handle_subscription_created(payload: dict, user_ops: UserOperations):
    """Handle subscription_created event."""
    try:
        # Extract data from payload
        data = payload.get("data", {})
        attributes = data.get("attributes", {})
        meta = payload.get("meta", {})
        custom_data = meta.get("custom_data", {})

        # Get user ID from custom data
        user_id = custom_data.get("user_id")
        if not user_id:
            logger.error("Missing user_id in custom_data")
            return

        # Extract subscription details
        customer_id = attributes.get("customer_id")
        variant_id = str(attributes.get("variant_id", ""))
        customer_portal_url = attributes.get("urls", {}).get("customer_portal")

        if not customer_id:
            logger.error("Missing customer_id in payload")
            return

        # Determine quota limit based on variant
        quota_limit = get_quota_limit_from_variant(variant_id)

        # Update user subscription info
        success = user_ops.update_subscription_info(
            user_id=user_id,
            customer_id=customer_id,
            subscription_status="active",
            quota_limit=quota_limit,
            quota_used=0,  # Reset quota on new subscription
            billing_portal_url=customer_portal_url,
        )

        if success:
            logger.info(f"Successfully activated subscription for user {user_id}")
        else:
            logger.error(f"Failed to update subscription for user {user_id}")

    except Exception as e:
        logger.error(f"Error handling subscription_created: {e}")


async def handle_subscription_cancelled(payload: dict, user_ops: UserOperations):
    """Handle subscription_cancelled event."""
    try:
        # Extract data from payload
        data = payload.get("data", {})
        attributes = data.get("attributes", {})

        # Get customer ID
        customer_id = attributes.get("customer_id")
        if not customer_id:
            logger.error("Missing customer_id in payload")
            return

        # Update subscription status to cancelled
        success = user_ops.update_subscription_info_by_customer_id(
            customer_id=customer_id, subscription_status="cancelled"
        )

        if success:
            logger.info(
                f"Successfully cancelled subscription for customer {customer_id}"
            )
        else:
            logger.error(f"Failed to cancel subscription for customer {customer_id}")

    except Exception as e:
        logger.error(f"Error handling subscription_cancelled: {e}")


async def handle_subscription_payment_success(payload: dict, user_ops: UserOperations):
    """Handle subscription_payment_success event."""
    try:
        # Extract data from payload
        data = payload.get("data", {})
        attributes = data.get("attributes", {})

        # Get customer ID
        customer_id = attributes.get("customer_id")
        if not customer_id:
            logger.error("Missing customer_id in payload")
            return

        # Reset quota for the new billing period
        success = user_ops.update_subscription_info_by_customer_id(
            customer_id=customer_id, quota_used=0
        )

        if success:
            logger.info(f"Successfully reset quota for customer {customer_id}")
        else:
            logger.error(f"Failed to reset quota for customer {customer_id}")

    except Exception as e:
        logger.error(f"Error handling subscription_payment_success: {e}")
