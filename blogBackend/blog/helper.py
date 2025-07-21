import os
from dotenv import load_dotenv
import google.generativeai as genai


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


# ab iss method me keyword extract krna hoga
async def get_keywords_from_title(title: str) -> str:
    prompt = (
        f"Generate a list of 5 to 10 helpful keywords or topic ideas "
        f"that a writer can use when writing a blog titled: '{title}'. "
        f"Only return the keywords as a comma-separated list."
    )
    response = model.generate_content(prompt)
    return response.text.strip()