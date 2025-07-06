import jwt
from datetime import datetime , timedelta

SECRET_KEY = "blogSecret"
AlGORITHM = "HS256"

def create_token(data:dict,expires_delta : timedelta = timedelta(days=7)):
  to_encode = data.copy()
  expire = datetime.now() + expires_delta
  to_encode.update({"exp":expire})
  encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=AlGORITHM)
  return encoded_jwt

def decode_token(token:str):
  try:
    payload= jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
    return payload
  except jwt.ExpiredSignatureError:
    raise Exception("token expired")
  except jwt.InvalidTokenError:
    raise Exception("invalid token")

