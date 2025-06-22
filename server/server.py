import mysql.connector
import os
from fastapi import FastAPI, Request, Header, HTTPException, status
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from pydantic import BaseModel
from datetime import date
from fastapi import Path

MY_SECRET = "secret"
ALGORITHM = "HS256"

class Login(BaseModel):
    email: str
    password: str


app = FastAPI()
origins = [
    "http://localhost:3000",
    "https://arseid.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    id: Optional[int] = None
    surname: str
    name: str
    email: str
    birthdate: date
    city: str
    postal_code: str

@app.get("/")
async def hello_world():
    return "Hello world"

@app.get("/users")
async def get_users():
    # Create a connection to the database
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST"))
    cursor = conn.cursor()
    sql_select_Query = "select * from user"
    cursor.execute(sql_select_Query)
    # get all records
    records = cursor.fetchall()
    users = []
    for row in records:
        user_dict = {
            "id": row[0],
            "surname": row[1],
            "name": row[2],
            "email": row[3],
            "birthdate": row[4],
            "city": row[5],
            "postal_code": row[6]
        }
        users.append(User(**user_dict))
    print("Total number of rows in table: ", cursor.rowcount)
    cursor.close()
    conn.close()
    # renvoyer nos données et 200 code OK
    return {'utilisateurs': users}

@app.post("/users")
async def create_user(user: User):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST"))
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO user (surname, name, email, birthdate, city, postal_code) VALUES (%s, %s, %s, %s, %s, %s)",
        (user.surname, user.name, user.email, user.birthdate, user.city, user.postal_code)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User created successfully"}

@app.post("/login")
async def create_user(login: Login):
    conn = mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_ROOT_PASSWORD"),
        port=3306,
        host=os.getenv("MYSQL_HOST"))
    cursor = conn.cursor()
    email = login.email
    password = login.password
    sql_select_Query = "select * from admin WHERE email=\""+ str(email) +"\" AND password=\""+ str(password)+"\";"
    cursor.execute(sql_select_Query)
    # get all records
    records = cursor.fetchall()
    if cursor.rowcount > 0:
        encoded_jwt = jwt.encode({'data': [{'email':email}]}, MY_SECRET, algorithm=ALGORITHM)
        return encoded_jwt
    else:
        raise Exception("Bad credentials")

@app.delete("/users/{id}")
async def deleteUser(
    id: str = Path(..., description="User ID"),
    authorization: Optional[str] = Header(None)
):
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme. Must be 'Bearer'.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ")[1]
    try:
        decoded_payload = jwt.decode(token, MY_SECRET, algorithms=[ALGORITHM])

        conn = mysql.connector.connect(
            database=os.getenv("MYSQL_DATABASE"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_ROOT_PASSWORD"),
            port=3306,
            host=os.getenv("MYSQL_HOST")
        )
        cursor = conn.cursor()

        # Vérifier que l'utilisateur existe
        cursor.execute("SELECT * FROM user WHERE id = %s", (id,))
        user = cursor.fetchone()
        if not user:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="User not found")

        # Supprimer l'utilisateur
        cursor.execute("DELETE FROM user WHERE id = %s", (id,))
        conn.commit()

        cursor.close()
        conn.close()
        return {"message": f"User with id {id} deleted successfully."}
    except ExpiredSignatureError:
        print("Erreur : Le jeton JWT a expiré.")
        raise Exception("Bad credentials")
    except InvalidTokenError as e:
        print(f"Erreur : Le jeton JWT est invalide : {e}")
        raise Exception("Bad credentials")
    except Exception as e:
        print(f"Une erreur inattendue est survenue lors de la vérification du jeton : {e}")
        raise Exception("Bad credentials")
