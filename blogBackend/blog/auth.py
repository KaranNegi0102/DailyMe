import jwt
from datetime import datetime , timedelta
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def create_token(data:dict,expires_delta : timedelta = timedelta(days=7)):
  to_encode = data.copy()
  expire = datetime.utcnow() + expires_delta
  to_encode.update({"exp":expire})
  encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
  return encoded_jwt

def decode_token(token:str):
  # print(f"token is {token}")
  # print("am here going to decode the token")
  try:
    # print("one step above decoding")
    payload= jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
    # print(f"payload is {payload}")
    return payload
  except jwt.ExpiredSignatureError:
    raise Exception("token expired")
  except jwt.InvalidTokenError:
    raise Exception("invalid token")

