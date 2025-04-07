# app/inference_server.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
import json

app = FastAPI()

# ✅ CORS 설정 (필요시 허용 범위 좁히기)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 클래스 라벨 로딩
label_classes = np.load("models/label_classes_dynamic.npy")

# ✅ TFLite 모델 로딩
interpreter = tf.lite.Interpreter(model_path="models/dynamic_gesture_lstm.tflite")
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()


def predict(input_vector: np.ndarray) -> tuple[str, float]:
    interpreter.set_tensor(input_details[0]["index"], input_vector.astype(np.float32))
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]["index"])

    confidence = float(np.max(output_data))
    label_idx = int(np.argmax(output_data))

    if confidence < 0.7:
        return "none", confidence * 100
    return label_classes[label_idx], confidence * 100

@app.websocket("/ws/dynamic-gesture/predict")
async def ws_predict(websocket: WebSocket):
    await websocket.accept()
    print("[✅ 연결됨] 클라이언트 WebSocket 접속")

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            frames = payload.get("frames", [])  # (50, 64)

            if not isinstance(frames, list) or len(frames) != 50:
                await websocket.send_text(json.dumps({"error": "Invalid sequence (50 frames expected)"}))
                continue

            input_seq = np.array(frames).reshape(1, 50, 64)
            label, confidence = predict(input_seq)

            await websocket.send_text(json.dumps({
                "gesture": label,
                "confidence": round(confidence, 2)
            }))

    except Exception as e:
        print("[❌ 오류]", e)
    finally:
        await websocket.close()
        print("[🛑 연결 종료됨]")
