"""Logging configuration for the backend."""

import logging

import axiom_py
from axiom_py.logging import AxiomHandler

from config import config


def setup_logger():
    client = axiom_py.Client(config.AXIOM_API_TOKEN)
    handler_axiom = AxiomHandler(client, "translateprompt")

    # Get the root logger
    root_logger = logging.getLogger()
    root_logger.addHandler(handler_axiom)
    root_logger.setLevel(logging.INFO)

    # Set specific log levels for noisy third-party libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("requests").setLevel(logging.WARNING)

    return root_logger


logger = None

if config.PROD:
    logger = setup_logger()
else:
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())
