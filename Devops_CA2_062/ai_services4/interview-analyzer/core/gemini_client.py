import os
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found. Check your .env file.")

def call_gemini_ai(prompt: str) -> str:
    """Send a prompt to Gemini and return plain text output."""
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    headers = {"Content-Type": "application/json"}

    resp = requests.post(f"{API_URL}?key={GEMINI_API_KEY}", headers=headers, json=payload)

    if resp.status_code == 200:
        try:
            candidates = resp.json().get("candidates", [])
            if candidates:
                return candidates[0]["content"]["parts"][0]["text"].strip()
            return ""
        except Exception as e:
            print("Error parsing Gemini response:", e)
            return ""
    else:
        print("Gemini API error:", resp.status_code, resp.text)
        return ""
