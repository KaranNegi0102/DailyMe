from fastapi import FastAPI , HTTPException
from  pydantic import BaseModel
from blog.db import get_cursor, conn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
def login(user:LoginUserIn):
  cur = get_cursor()
  try:
    cur.execute("SELECT * FROM users WHERE username=%s AND password=%s",(user.username,user.password))
    usersData = cur.fetchone()

    if not usersData:
      return {"error":"invalid username or password"}

    res_userData=[{"id":usersData[0],"username":usersData[1],"password":usersData[2]}  for i in usersData ]

    return res_userData[0]

  except Exception as e:
    raise HTTPException(status_code=400,detail="invalid username or password")


@app.post("/blogs")
def create_blog(blog: BlogIn, user_id: int):
    cur = get_cursor()
    cur.execute("INSERT INTO blogs (title, content, owner_id) VALUES (%s, %s, %s) RETURNING id", (blog.title, blog.content, user_id))
    blog_id = cur.fetchone()[0]
    conn.commit()
    return {"message": "Blog created", "blog_id": blog_id}
 
@app.get("/blogs")
def get_all_blogs():
    cur = get_cursor()
    cur.execute("SELECT * FROM blogs")
    blogs = cur.fetchall()
    print(f"blogs area : {blogs}")
    return [{"id": b[0], "title":b[1], "content":b[2], "owner_id":b[3]} for b in blogs]  #list comprehensions  

@app.get("/myblogs")
def get_my_blog(user_id:int):
  cur = get_cursor()
  cur.execute("SELECT * FROM blogs WHERE owner_id=%s",(user_id,))
  blogs=cur.fetchall()
  return [{"id":b[0], "title":b[1], "content":b[2],"owner_id":b[3]} for b in blogs]

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






