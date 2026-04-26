from __future__ import annotations


def _split_long_paragraph(paragraph: str, *, max_chars: int) -> list[str]:
    sentences = paragraph.replace("; ", ". ").split(". ")
    chunks: list[str] = []
    current = ""

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        if not sentence.endswith("."):
            sentence = f"{sentence}."

        if current and len(current) + 1 + len(sentence) > max_chars:
            chunks.append(current.strip())
            current = sentence
        else:
            current = f"{current} {sentence}".strip()

    if current:
        chunks.append(current.strip())

    return chunks


def _markdown_sections(paragraphs: list[str]) -> list[str]:
    sections: list[str] = []
    current: list[str] = []

    for paragraph in paragraphs:
        if paragraph.startswith("## ") and current:
            sections.append("\n\n".join(current))
            current = [paragraph]
        else:
            current.append(paragraph)

    if current:
        sections.append("\n\n".join(current))

    return sections


def chunk_text(text: str, *, max_chars: int = 950, overlap: int = 0) -> list[str]:
    normalized_lines = [line.strip() for line in text.strip().splitlines()]
    normalized = "\n".join(normalized_lines)
    paragraphs = [paragraph.strip() for paragraph in normalized.split("\n\n") if paragraph.strip()]
    sections = _markdown_sections(paragraphs)

    if len("\n\n".join(sections)) <= max_chars:
        return ["\n\n".join(sections)]

    chunks: list[str] = []
    current: list[str] = []

    for section in sections:
        if len(section) > max_chars:
            if current:
                chunks.append("\n\n".join(current))
                current = []
            chunks.extend(_split_long_paragraph(section, max_chars=max_chars))
            continue

        candidate = "\n\n".join([*current, section])
        if current and len(candidate) > max_chars:
            chunks.append("\n\n".join(current))
            current = [section]
        else:
            current.append(section)

    if current:
        chunks.append("\n\n".join(current))

    return [chunk for chunk in chunks if chunk]
