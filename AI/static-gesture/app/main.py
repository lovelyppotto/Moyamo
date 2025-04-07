from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from tensorflow.lite.python.interpreter import Interpreter
import json

app = FastAPI()

# ✅ CORS 설정 (프론트에서 접근 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 클래스 라벨 로딩
label_classes = np.load("models/label_classes_mk2.npy")

# ✅ TFLite 모델 로딩
interpreter = Interpreter(model_path="models/static_gesture_mk2_model.tflite")
interpreter.allocate_tensors()

# 입력/출력 텐서 정보 추출
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# ✅ 정규화 함수
def normalize_landmarks(joint):
    joint = np.array(joint).reshape(21, 3)
    origin = joint[0]
    joint -= origin
    norm = np.linalg.norm(joint)
    if norm > 0:
        joint /= norm
    return joint.flatten()

# ✅ 추론 함수 (TFLite)
def predict(input_vector: np.ndarray) -> tuple[str, float]:
    interpreter.set_tensor(input_details[0]['index'], input_vector.astype(np.float32))
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])  # softmax

    max_conf = float(np.max(output_data))
    pred_idx = int(np.argmax(output_data))

    if max_conf < 0.7:
        return "없음", max_conf * 100
    else:
        return label_classes[pred_idx], max_conf * 100


# ✅ WebSocket 실시간 추론 엔드포인트
@app.websocket("/ws/predict")
async def predict_ws(websocket: WebSocket):
    await websocket.accept()
    print("[✅ 연결됨] 클라이언트 WebSocket 접속")

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            frames = payload.get("frames", [])

            print(f"[📥 수신 완료] 손 개수: {len(frames)}")

            if not frames or not isinstance(frames, list):
                await websocket.send_text(json.dumps({"error": "No valid frames"}))
                continue

            main_hand = frames[0]

            if not isinstance(main_hand, list) or len(main_hand) != 21:
                print(f"[❌ landmark 수 오류] {len(main_hand)}개 받음")
                await websocket.send_text(json.dumps({"error": "Expected 21 landmarks"}))
                continue

            try:
                joint = np.array([[lm["x"], lm["y"], lm["z"]] for lm in main_hand])
                norm_joint = normalize_landmarks(joint)
                is_two_hands = 1 if len(frames) == 2 else 0
                input_vector = np.append(norm_joint, is_two_hands).reshape(1, 64, 1)

                gesture, confidence = predict(input_vector)
                print(f"[✅ 예측 완료] 결과: {gesture} | 확률: {confidence:.2f}%")
                
                await websocket.send_text(json.dumps({
                    "gesture": gesture,
                    "confidence": round(confidence, 1)
                }))
                
            except Exception as parse_error:
                print("[⚠️ landmark 파싱 실패]", parse_error)
                await websocket.send_text(json.dumps({"error": "Failed to process landmarks"}))

    except Exception as e:
        print("[❌ 예외 발생]", e)
    finally:
        await websocket.close()
        print("[🛑 연결 종료됨]")
