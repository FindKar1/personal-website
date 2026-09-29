import importlib.util
from io import BytesIO
from pathlib import Path
import unittest
from unittest.mock import patch

from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/documents/bytespace-overview.pdf"
spec = importlib.util.spec_from_file_location(
    "healthcare_diagram", ROOT / "scripts/prepare-healthcare-diagram.py"
)
diagram = importlib.util.module_from_spec(spec)
spec.loader.exec_module(diagram)


class HealthcareDiagramTests(unittest.TestCase):
    def test_only_intended_text_changes_and_original_fonts_survive_export(self):
        original_bytes = SOURCE.read_bytes()
        reader = PdfReader(BytesIO(original_bytes))
        for number in (9, 11, 17):
            with self.subTest(page=number):
                original = reader.pages[number - 1]
                original_text = original.extract_text()
                expected = original_text.replace("Knoweldge", "Knowledge").replace(
                    "Historial Data", "Historical Data"
                )
                if number in diagram.HEADINGS:
                    prefix = "1." if number == 11 else "3."
                    expected = expected.replace(prefix + diagram.HEADINGS[number], diagram.HEADINGS[number])

                corrected = diagram.correct_page(reader, number)
                writer = PdfWriter()
                writer.add_page(corrected)
                output = BytesIO()
                writer.write(output)
                output.seek(0)
                result = PdfReader(output)
                self.assertEqual(len(result.pages), 1)
                page = result.pages[0]
                self.assertEqual(page.extract_text().split(), expected.split())
                self.assertEqual(page.mediabox, original.mediabox)
                self.assertEqual(original.extract_text(), original_text)

                fonts = original["/Resources"]["/Font"]
                for name, reference in page["/Resources"]["/Font"].items():
                    font = reference.get_object()
                    self.assertEqual(font["/BaseFont"], fonts[name]["/BaseFont"])
                    descriptor = font["/DescendantFonts"][0].get_object()["/FontDescriptor"]
                    original_descriptor = fonts[name]["/DescendantFonts"][0].get_object()["/FontDescriptor"]
                    self.assertEqual(descriptor["/FontFile2"].get_data(), original_descriptor["/FontFile2"].get_data())
        self.assertEqual(SOURCE.read_bytes(), original_bytes)

    def test_other_pages_are_rejected(self):
        with self.assertRaisesRegex(ValueError, "Only the three selected"):
            diagram.correct_page(PdfReader(SOURCE), 10)

    def test_source_cannot_be_overwritten(self):
        with patch("sys.argv", [str(spec.origin), str(SOURCE), "11", str(SOURCE)]):
            with self.assertRaisesRegex(ValueError, "Keep the original"):
                diagram.main()


if __name__ == "__main__":
    unittest.main()
