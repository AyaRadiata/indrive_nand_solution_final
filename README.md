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
- Node.js (for client-side)
- FastAPI (pip install fastapi uvicorn)
- OpenAI Python SDK (pip install openai)
- Other dependencies: 


How to Run
NOTE: this github project doesn't have venv so you will need to make it yourself. Also it will not run without OPENAI API key that is a secret key.

1. Clone repo
git clone BLANK
cd BLANK

2. Install Python deps
pip install openai fastapi pydantic pillow ultralytics uvicorn python-multipart

3. Set environment variable
export OPENAI_API_KEY=your_api_key_here
(on Windows use set instead of export)
or just write it mannualy in server.py

4. Start FastAPI server
uvicorn server:app --reload

Run client
Open the client (JavaScript/HTML app in BLANK) and upload an image.
It will send the image to the FastAPI server and display the JSON result.


Data & Licenses
- Uses OpenAI API for image analysis (see OpenAI Terms of Use).
- Uploaded images are processed through the API but not stored locally.
- Datasets, images, or third-party libs were included: Roboflow "CarDD" dataset

Limitations
- The model may not always return perfectly valid JSON; server includes fallback parsing.
- Ratings are approximate and not suitable for official insurance / legal use.
- Requires active internet connection + valid OpenAI API key.
- This project is a demo/prototype

License
Apache-2.0

