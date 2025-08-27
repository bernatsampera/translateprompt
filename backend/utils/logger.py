"""Logging configuration for the backend."""

import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s | %(message)s"))
logger.addHandler(handler)
