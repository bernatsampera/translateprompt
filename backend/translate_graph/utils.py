from database.models import LangRuleEntry


def format_glossary(glossary: dict[str, dict[str, str]]) -> str:
    """Format the glossary to be used in the prompt."""
    return "\n".join(
        [
            f"{key}: {value['target']} ({value['note']})"
            for key, value in glossary.items()
        ]
    )


def format_rules(rules: list[LangRuleEntry]) -> str:
    """Format the rules to be used in the prompt."""
    return "\n".join([rule.text for rule in rules])
