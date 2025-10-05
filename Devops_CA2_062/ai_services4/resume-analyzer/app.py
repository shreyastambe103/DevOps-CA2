from fastapi import FastAPI, UploadFile, File
from core import optimizer, chunking_similarity as cs
from services import preprocessing
import pdfplumber
import io
import traceback
from dotenv import load_dotenv
import os

load_dotenv()  # This will load .env variables into os.environ
print("GEMINI_API_KEY:", os.environ.get("GEMINI_API_KEY"))
app = FastAPI(title="Resume Analyzer")



async def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """Extract text from PDF bytes safely."""
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
    except Exception as e:
        print("PDF extraction error:", e)
    return text


@app.post("/analyze")
async def analyze_resume(
    resume_file: UploadFile = File(...),
    jd_file: UploadFile = File(...)
):
    try:
        # Read uploaded files as bytes
        resume_bytes = await resume_file.read()
        jd_bytes = await jd_file.read()

        # Extract and preprocess text
        resume_text = preprocessing.clean_text(await extract_text_from_pdf_bytes(resume_bytes))
        jd_text = preprocessing.clean_text(await extract_text_from_pdf_bytes(jd_bytes))

        # Lemmatize
        clean_resume = preprocessing.lemmatize_text(resume_text)
        clean_jd = preprocessing.lemmatize_text(jd_text)

        # Chunking & embeddings
        resume_chunks = cs.chunk_text(clean_resume)
        jd_chunks = cs.chunk_text(clean_jd)

        resume_embeds = cs.get_embeddings(resume_chunks)
        jd_embeds = cs.get_embeddings(jd_chunks)

        similarity_matrix = cs.compute_similarity(resume_embeds, jd_embeds)
        before_metrics = cs.compute_missing(similarity_matrix, resume_chunks, jd_chunks)

        # Optimizer
        try:
            gemini_output = optimizer.optimize_resume(clean_resume, clean_jd, before_metrics)
        except Exception as e:
            error_details = traceback.format_exc()
            return {
                "error": "AI optimization failed",
                "message": str(e),
                "trace": error_details
            }

        # Compute after metrics
        after_metrics = cs.compute_after_metrics(gemini_output.get("optimized_resume_text", ""), jd_chunks)

        return {
            "before_missing_chunks": before_metrics.get("missing_chunks", []),
            "after_missing_chunks": after_metrics.get("missing_chunks", []),
            "optimized_resume_text": gemini_output.get("optimized_resume_text", ""),
            "missing_skills": gemini_output.get("missing_skills", []),
            "improvement_tips": gemini_output.get("improvement_tips", [])
        }

    except Exception as e:
        return {
            "error": "Resume analysis failed",
            "message": str(e),
            "trace": traceback.format_exc()
        }
