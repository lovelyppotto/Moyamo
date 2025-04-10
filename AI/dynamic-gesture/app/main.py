from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from pydantic import BaseModel
from typing import List
from collections import Counter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dynamic_label_classes = np.load("models/label_classes_dynamic.npy")
static_label_classes = np.load("models/label_classes_mk4_v1.npy")

dynamic_model = load_model("models/dynamic_gesture_lstm_v4.h5")
static_interpreter = tf.lite.Interpreter(model_path="models/static_gesture_mk4_v1_model_float16.tflite")
static_interpreter.allocate_tensors()

static_input = static_interpreter.get_input_details()
static_output = static_interpreter.get_output_details()

class DynamicRequest(BaseModel):
    frames: List[List[float]]

class StaticRequest(BaseModel):
    frames: List[List[float]]  # (1, 64)

def normalize_landmarks(joint):
    joint = np.array(joint).reshape(21, 3)
    origin = joint[0]
    joint -= origin
    norm = np.linalg.norm(joint)
    if norm > 0:
        joint /= norm
    return joint.flatten()

def get_majority_vote(predictions: List[str]):
    if not predictions:
        return "없음", 0.0
    counter = Counter(predictions)
    most_common_label, count = counter.most_common(1)[0]
    confidence = count / len(predictions) * 100
    return most_common_label, round(confidence, 2)

def predict_dynamic(input_vector: np.ndarray):
    if input_vector.shape[1] > 50:
        input_vector = input_vector[:, -50:, :]

    output_data = dynamic_model.predict(input_vector, verbose=0)[0]
    confidence = float(np.max(output_data))
    label_idx = int(np.argmax(output_data))
    return (dynamic_label_classes[label_idx], confidence * 100) if confidence >= 0.5 else ("none", confidence * 100)

def predict_static(input_vector: np.ndarray):
    static_interpreter.set_tensor(static_input[0]["index"], input_vector.astype(np.float32))
    static_interpreter.invoke()
    output_data = static_interpreter.get_tensor(static_output[0]["index"])
    confidence = float(np.max(output_data))
    label_idx = int(np.argmax(output_data))
    return (static_label_classes[label_idx], confidence * 100) if confidence >= 0.5 else ("없음", confidence * 100)

@app.post("/dynamic")
async def dynamic_api(req: DynamicRequest):
    if len(req.frames) < 50 or len(req.frames[0]) != 64:
        raise HTTPException(status_code=400, detail="Expected shape: (90, 64)")
    input_seq = np.array(req.frames).reshape(1, len(req.frames), 64)
    label, confidence = predict_dynamic(input_seq)
    return {"gesture": label, "confidence": round(confidence, 2)}

@app.post("/static")
async def static_api(req: StaticRequest):
    vectors = req.frames  # (N, 64)

    if not vectors or len(vectors[0]) != 64:
        raise HTTPException(status_code=400, detail="Expected shape: (N, 64)")

    try:
        predictions = []
        for vec in vectors:
            input_vector = np.array(vec).reshape(1, 64, 1)
            label, conf = predict_static(input_vector)
            predictions.append(label)

        if not predictions:
            return {"gesture": "없음", "confidence": 0.0}

        final_label = get_majority_vote(predictions)
        final_conf = 100.0 * predictions.count(final_label) / len(predictions)
        return {"gesture": final_label, "confidence": round(final_conf, 2)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
