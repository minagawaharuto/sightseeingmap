import os
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware       
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class RouteRequest(BaseModel):
    user_input:str

client = OpenAI()

@app.post("/api/generate-route")
async def generate_route(request:RouteRequest):
    try:
        response = client.chat.completions.create(
            model = "gpt-4o",
            messages = [
                {"role":"system","content":"あなたは優秀な観光ルート提案アシスタントです。ユーザーの要望に合わせて、最適なルート提案をしてください。"},
                {"role":"user", "content":request.user_input}
                ]
            )

        ai_message = response.choices[0].message.content
        return{"result":ai_message}
    except Exception as e:
        return {"result":f"エラーが発生しました:{str(e)}"}
        