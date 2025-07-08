from fastapi import FastAPI , HTTPException , Response
from  pydantic import BaseModel
from blog.db import get_cursor, conn
from fastapi.middleware.cors import CORSMiddleware
from blog.auth import create_token , decode_token
from fastapi import Cookie

from fastapi import File,UploadFile
from blog.cloud_config import cloudinary
import cloudinary.uploader






app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"]
)

# pydantic schemas for well defination 
class RegisterUserIn(BaseModel):
  username:str
  password:str
  phone:str
  email:str

class LoginUserIn(BaseModel):
  username:str
  password:str


class BlogIn(BaseModel):
  title:str
  content:str
  image_url:str | None = None




class BlogUpdate(BaseModel):
  title:str
  content:str


logged_in_users={}

# routes now onwards

@app.post("/register")
def register(user:RegisterUserIn):
  print(user)
  cur = get_cursor()
  try:
    cur.execute("INSERT INTO users(username,password,email,phone) VALUES(%s,%s,%s,%s) RETURNING id", (user.username,user.password,user.email,user.phone))
    user_id = cur.fetchone()[0]
    conn.commit()
    return { "message":"user registered", "user_id":user_id }
  except Exception as e:
    conn.rollback()
    raise HTTPException(status_code=400,detail="username already exists")



@app.post("/login")
def login(user:LoginUserIn,response:Response):
  cur = get_cursor()
  try:
    cur.execute("SELECT * FROM users WHERE username=%s AND password=%s",(user.username,user.password))
    usersData = cur.fetchone()

    print(f"usersData is {usersData}")

    if not usersData:
      return {"error":"invalid username or password in the backend"}

    res_userData=[{"id":usersData[0],"username":usersData[1],"password":usersData[2]}  for i in usersData ]

    user_payload = {
      "id":usersData[0],
      "username":usersData[1],
      "password":usersData[2],
      "email":usersData[3],
      "phone":usersData[4]
    }

    token = create_token(user_payload)

    # print(f"token is ->  {token}")
    
    response.set_cookie(
      key="auth_token",
      value=token,
      httponly=True,
      secure=False,
      samesite="Lax",
      max_age = 7 * 24 * 60 * 60
    )

    return res_userData[0]

  except Exception as e:
    raise HTTPException(status_code=400,detail="invalid username or password in the login backend code")



@app.get("/checkUser")
def check_user(auth_token:str = Cookie()):
  
  # print(f"this is auth token in backend python {auth_token}")

  if not auth_token:
    raise HTTPException(status_code=401,detail="unauthorized access")
  try:
    user = decode_token(auth_token)
    # print(f"this is user in backend python {user}")
    return user
  except Exception as e:
    raise HTTPException(status_code=401,detail="unauthorized")


# route banana h for image upload
@app.post("/upload_image")
def upload_image(file:UploadFile=File(...)):
  result = cloudinary.uploader.upload(file.file)
  print(f"this is result = {result}")
  return {"image_url":result["secure_url"]}


@app.post("/createBlogs")
def create_blog(blog: BlogIn, user_id: int):
    print(f"user_id is {user_id}")
    print(f"blog is {blog}")
    cur = get_cursor()
    cur.execute("INSERT INTO blogs (title, content, owner_id , image_url) VALUES (%s, %s, %s, %s) RETURNING id", (blog.title, blog.content, user_id,blog.image_url))
    blog_id = cur.fetchone()[0]
    conn.commit()
    return {"message": "Blog created", "blog_id": blog_id}


@app.get("/blogs")
def get_all_blogs():
    cur = get_cursor()
    cur.execute("SELECT * FROM blogs")
    blogs = cur.fetchall()
    print(f"blogs area : {blogs}")
    return [{"id": b[0], "title":b[1], "content":b[2], "owner_id":b[3], "created_at":b[4] , "image_url":b[5] } for b in blogs]  #list comprehensions  


@app.get("/myblogs")
def get_my_blog(user_id:int):
  cur = get_cursor()
  cur.execute("SELECT * FROM blogs WHERE owner_id=%s",(user_id,))
  blogs=cur.fetchall()
  return [{"id":b[0], "title":b[1], "content":b[2],"owner_id":b[3] , "created_at":b[4] , "image_url":b[5] } for b in blogs]

  

@app.post("/blogs/{blog_id}")
def delete_blog(blog_id:int,user_id:int):
  cur = get_cursor()
  cur.execute("SELECT owner_id FROM blogs WHERE id=%s",(blog_id,))
  owner_id = cur.fetchone()
  if not owner_id:
    raise HTTPException(status_code=404,detail="blog not found")
  if owner_id[0] != user_id:
    raise HTTPException(status_code=403,detail="you are not authorized to delete this blog")

  cur.execute("DELETE FROM blogs WHERE id=%s" ,(blog_id,))
  conn.commit()
  return {"message":"blog deleted"}






