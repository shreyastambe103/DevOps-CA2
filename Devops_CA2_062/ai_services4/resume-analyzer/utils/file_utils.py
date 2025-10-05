import io
from fastapi import UploadFile
import pdfplumber

def extract_text_from_pdf(file: UploadFile) -> str:
    text = ""
    content = file.file.read()  # get bytes
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text
    return text
