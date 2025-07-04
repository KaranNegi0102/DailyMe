import psycopg2
import os

conn = psycopg2.connect(
  dbname="blogSite",
  user="bloguser",
  password="blogpassword",
  host="localhost",
  port="5432",
)

def get_cursor():
  return conn.cursor()

