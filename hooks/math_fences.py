"""Normalize legacy ``$$...$$`` blocks before Markdown parses them."""

import re


_PROTECTED = re.compile(r"(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)")
_DISPLAY_MATH = re.compile(r"\$\$([\s\S]*?)\$\$")


def _normalize(segment: str) -> str:
    def replace(match: re.Match[str]) -> str:
        expression = match.group(1).strip()
        return f'\n\n<div class="arithmatex">\\[{expression}\\]</div>\n\n'

    return _DISPLAY_MATH.sub(replace, segment)


def on_page_markdown(markdown: str, **kwargs) -> str:
    """Convert legacy display math while leaving code spans and fences intact."""
    parts = _PROTECTED.split(markdown)
    return "".join(part if index % 2 else _normalize(part) for index, part in enumerate(parts))
