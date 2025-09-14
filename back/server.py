from fastapi import FastAPI, File, UploadFile   # ✅ add File here
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse, StreamingResponse
from pydantic import BaseModel
from PIL import Image, ImageDraw, ImageFont
from ultralytics import YOLO
import cv2
import io, zipfile, base64
from openai import OpenAI
import uvicorn
import json, re

OPENAI_API = ""

useai = False

if(OPENAI_API != ""):
    useai = True


assistant_content = """
    You are a system that reads images and rates cars in those images.
Rate how dirty it is and how damaged it is, each out of 5 and be less strict.
If there is no car then say: {"dirtiness": 0, "damage": 0, "final": 0, "desc": "there is no car in the picture"}.
The output must ONLY be valid JSON with the following keys:

{
  "dirtiness": <integer 0-5>,
  "damage": <integer 0-5>,
  "final": <integer 0-5>,
  "desc": "<very short explanation>"
}
"""


client = OpenAI(api_key=OPENAI_API)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model1 = YOLO("my_model1/train/weights/best1.pt")

font = ImageFont.truetype("arial.ttf", size=24)

@app.post("/detect")
async def detect(files: list[UploadFile] = File(...)):
    results_list = []
    openai_messages = []
    print(files)

    for file in files:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        if(useai):
            # OPENAI RESPONSES
            buf1 = io.BytesIO()
            image.save(buf1, format="PNG", quality=50)  # convert to PNG bytes
            img_bytes1 = buf1.getvalue()
            img_base64_1 = base64.b64encode(img_bytes1).decode("utf-8")

            data_url = f"data:image/png;base64,{img_base64_1}"

            response = client.responses.create(
                model="gpt-4o-mini",   
                input=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "input_text", "text": assistant_content},
                            {"type": "input_image", "image_url": data_url},
                        ],
                    }
                ],
            )

            reply = response.output_text.strip()

            match = re.search(r"\{.*\}", reply, re.DOTALL)
            if match:
                try:
                    reply_json = json.loads(match.group(0))
                except json.JSONDecodeError:
                    reply_json = {"error": "invalid JSON format returned"}
            else:
                reply_json = {"error": "no JSON found in response"}

            openai_messages.append(reply_json)

        



        # ML MODEL RESPONSES
        yolo_results = model1(image)[0]  # results[0] for first image

        draw = ImageDraw.Draw(image)

        boxes = yolo_results.boxes.xyxy.numpy()  # bounding boxes
        scores = yolo_results.boxes.conf.numpy()  # confidences
        labels = yolo_results.boxes.cls.numpy()  # class indices
        class_names = model1.names

        detections = []

        for i in range(len(boxes)):
            x1, y1, x2, y2 = boxes[i]
            label = class_names[int(labels[i])]
            score = float(scores[i])
            detections.append({
                "label": label,
                "confidence": score,
                "box": [float(x1), float(y1), float(x2), float(y2)]
            })

            # Draw bounding box on the image
            draw.rectangle([x1, y1, x2, y2], outline="red", width=5)
            draw.text((x1, y1-10), f"{label} {score:.2f}", fill="blue", font=font)

        # Convert processed image to base64
        buf = io.BytesIO()
        image.save(buf, format="PNG")
        base64_img = base64.b64encode(buf.getvalue()).decode("utf-8")

        results_list.append({
            "image": f"data:image/png;base64,{base64_img}",
            "detections": detections
        })

    return JSONResponse(content={"results": results_list, "ai_results": openai_messages})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000)