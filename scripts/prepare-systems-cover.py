"""Build the portfolio opener from the original deck's vector art and fonts.

Usage: python prepare-systems-cover.py /path/to/original-deck.pdf
Requires pypdf, reportlab, Pillow, and pdftoppm.
"""

import argparse
from copy import deepcopy
from io import BytesIO
from pathlib import Path
import subprocess
from tempfile import TemporaryDirectory

from PIL import Image
from pypdf import PdfReader, PdfWriter, Transformation
from pypdf.generic import ContentStream, NameObject, RectangleObject
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


def register_embedded_font(reader, name, family, text):
    for page in reader.pages:
        for reference in page["/Resources"].get("/Font", {}).values():
            resource = reference.get_object()
            if str(resource["/BaseFont"]).split("+")[-1] != family:
                continue
            descriptor = resource["/DescendantFonts"][0]["/FontDescriptor"]
            font = TTFont(name, BytesIO(descriptor["/FontFile2"].get_data()))
            if all(ord(character) in font.face.charToGlyph for character in text):
                pdfmetrics.registerFont(font)
                return
    raise ValueError(f"No embedded {family} subset supports the cover text")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    args = parser.parse_args()
    source = PdfReader(args.source)
    title = ["BUILDING AGILE", "ORGANIZATIONS"]
    subtitle = ["Mapping how work moves.", "Finding what needs to change."]
    credit = "by Kar Dhillon"
    register_embedded_font(source, "DeckTitle", "Kollektif-Bold", " ".join(title))
    register_embedded_font(source, "DeckBody", "Kollektif", " ".join(subtitle))
    register_embedded_font(source, "DeckCredit", "Kollektif-Italic", credit)

    buffer = BytesIO()
    page = canvas.Canvas(buffer, pagesize=(1440, 810))
    page.setTitle("Building Agile Organizations")
    page.setAuthor("Kar Dhillon")
    page.setFillColorRGB(0, 0.2902, 0.6784)
    page.rect(0, 0, 1440, 810, fill=1, stroke=0)
    page.setFillColor(HexColor("#ffffff"))
    page.setFont("DeckTitle", 62)
    for line, y in zip(title, [480, 409]):
        assert pdfmetrics.stringWidth(line, "DeckTitle", 62) < 665
        page.drawString(88, y, line)
    page.setFillColor(HexColor("#ccdfff"))
    page.setFont("DeckBody", 28)
    for line, y in zip(subtitle, [330, 290]):
        page.drawString(90, y, line)
    page.setFillColor(HexColor("#ffffff"))
    page.setFont("DeckCredit", 23)
    page.drawString(90, 115, credit)
    page.save()

    cover = PdfReader(buffer).pages[0]
    illustration = deepcopy(source.pages[0])
    content = ContentStream(illustration["/Contents"], source)
    operations = []
    background = False
    for operands, operator in content.operations:
        if operator == b"re" and operands == [0, 0, 1920, 1080]:
            background = True
        elif background and operator == b"f":
            background = False
        else:
            operations.append((operands, operator))
    # Leave the artwork transparent so its clipped page background cannot leave a seam.
    content.operations = operations
    illustration[NameObject("/Contents")] = content
    # Clip the original vector illustration, excluding the claim and template copy.
    illustration.cropbox = RectangleObject((845, 215, 1310, 680))
    transform = Transformation().translate(-845, -215).scale(1.16).translate(810, 170)
    cover.merge_transformed_page(illustration, transform)
    writer = PdfWriter()
    writer.add_page(cover)
    output = Path(__file__).resolve().parents[1] / "public/media/systems/business-systems-cover.webp"
    with TemporaryDirectory(prefix="systems-cover-") as temporary:
        temporary = Path(temporary)
        pdf = temporary / "cover.pdf"
        writer.write(pdf)
        subprocess.run([
            "pdftoppm", "-singlefile", "-png", "-scale-to-x", "2400", "-scale-to-y", "1350",
            str(pdf), str(temporary / "cover"),
        ], check=True)
        with Image.open(temporary / "cover.png") as image:
            image.save(output, "WEBP", quality=94, method=6)
    print(f"Created {output}")


if __name__ == "__main__":
    main()
