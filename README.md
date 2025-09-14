This project provides a simple client–server application for analyzing car images using the OpenAI API.  
It takes an image as input and returns a JSON response with ratings on **dirtiness**, **damage**, and a **final average rating**, along with a short explanation.

---

## 🚀 Features
- Client-side (JavaScript) sends images to the server.
- Server-side (Python + FastAPI) processes images with the OpenAI API.
- Returns clean JSON response:
  ```json
  {
    "dirtiness": 7,
    "damage": 3,
    "final": 5,
    "desc": "Car is moderately dirty, slightly damaged."
  }

Requirements
- Python 3.10+
- Node.js (for client-side, version BLANK+)
- FastAPI (pip install fastapi uvicorn)
- OpenAI Python SDK (pip install openai)
- Any additional deps: BLANK


How to Run
NOTE: this github project doesn't have venv so you will need to make it yourself. Also it will not run without OPENAI API key that is a secret key.
