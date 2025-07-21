import os
from dotenv import load_dotenv
from helper import get_keywords_from_title
import google.generativeai as genai


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key = GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

async def chat_with_bot(user_input:str):
  if "weather" in user_input.lower():
    try:
      extract_prompt = (f"Extract only the city name from this sentence:\n" 
                        f"'{user_input}'\n"
                        f"If there is no city, reply with 'None'.")
      
      extract_response = model.generate_content(extract_prompt)
      city = extract_response.text.strip()
      weather = await get_weather(city)
      return weather
    except Exception:
      return f"Sorry , I couldn't process the temperature of the {city}"
  
  elif "get keywords for" in user_input.lower():
    title = user_input.lower().replace("get keywords for", "").strip().strip("'\"")
    keywords = await get_keywords_from_title(title)
    return f"Here are some keywords to help with your blog:\n{keywords}"

  else:
    response = model.generate_content(user_input)
    return response.text