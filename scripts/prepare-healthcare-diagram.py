"""Correct showcase excerpts without altering the archived source deck.

Usage: python prepare-healthcare-diagram.py source.pdf page output.pdf
Requires pypdf. Text is edited as glyphs in the original embedded Space Mono font.
"""

import argparse
from copy import deepcopy
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from pypdf._cmap import get_encoding
from pypdf.generic import ByteStringObject, ContentStream, FloatObject, NameObject


HEADINGS = {
    11: "Set a strong data foundation",
    17: "Leverage data to optimize the system",
}


def correct_page(reader, number):
    if number not in (9, 11, 17):
        raise ValueError("Only the three selected healthcare excerpts are supported")
    page = deepcopy(reader.pages[number - 1])
    fonts = page["/Resources"]["/Font"]
    content = ContentStream(page["/Contents"], reader)
    result, block, edits = [], [], []

    for operands, operator in content.operations:
        if operator == b"BT" or block:
            block.append((operands, operator))
            if operator != b"ET":
                continue
            font_args = next(args for args, op in block if op == b"Tf")
            font = fonts[font_args[0]].get_object()
            encoding, cmap = get_encoding(font)
            if encoding != "utf-16-be":
                raise ValueError("Expected the source deck's Identity-H font encoding")
            glyphs = "".join(args[0].original_bytes.decode(encoding) for args, op in block if op == b"Tj")
            text = "".join(cmap.get(char, char) for char in glyphs)
            replacement = text.replace("Knoweldge", "Knowledge").replace("Historial Data", "Historical Data")
            heading = text == HEADINGS.get(number)
            step_number = number in HEADINGS and float(font_args[1]) > 50 and text in ("1", "3", ".")

            if step_number:
                edits.append(text)
                block = []
                continue
            if replacement != text or heading:
                if "SpaceMono" not in str(font["/BaseFont"]):
                    raise ValueError("Expected the original monospaced font")
                if {op for _, op in block} - {b"BT", b"Tf", b"Tm", b"Tj", b"Td", b"ET"}:
                    raise ValueError("Unexpected text layout in source excerpt")
                inverse = {value: key for key, value in cmap.items() if isinstance(key, str)}
                moves = [float(args[0]) for args, op in block if op == b"Td"]
                advance = sum(moves) / len(moves)
                matrix = next(args for args, op in block if op == b"Tm")
                # Preserve each label's center; remove the heading prefix without shifting its visual center.
                shift = (len(text) - len(replacement)) * advance / 2
                if heading:
                    shift -= (float(matrix[4]) - 20.046875) / 2
                matrix[4] = FloatObject(float(matrix[4]) + shift)
                rewritten = [([], b"BT"), (font_args, b"Tf"), (matrix, b"Tm")]
                for index, char in enumerate(replacement):
                    if index:
                        rewritten.append(([FloatObject(advance), FloatObject(0)], b"Td"))
                    rewritten.append(([ByteStringObject(inverse[char].encode(encoding))], b"Tj"))
                rewritten.append(([], b"ET"))
                result.extend(rewritten)
                edits.append(text)
            else:
                result.extend(block)
            block = []
        else:
            result.append((operands, operator))

    expected = 1 if number == 9 else 5 if number == 11 else 4
    if len(edits) != expected:
        raise ValueError(f"Page {number}: expected {expected} corrections, found {edits}")
    content.operations = result
    page[NameObject("/Contents")] = content
    return page


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("page", type=int)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    if args.source.resolve() == args.output.resolve():
        raise ValueError("Keep the original source deck unchanged")
    writer = PdfWriter()
    writer.add_page(correct_page(PdfReader(args.source), args.page))
    writer.write(args.output)


if __name__ == "__main__":
    main()
