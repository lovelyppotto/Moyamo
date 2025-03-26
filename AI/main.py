# import asyncio
# import os
# import tempfile
# from collections import Counter
# from concurrent.futures import ThreadPoolExecutor

# import cv2
# import mediapipe as mp
# import numpy as np
# import tensorflow as tf
# from fastapi import FastAPI, File, UploadFile

# app = FastAPI()

# # 모델 및 MediaPipe 초기화 (글로벌 로드)
# model = tf.keras.models.load_model('models/model.h5', compile=False)
# mp_hands = mp.solutions.hands
# hands = mp_hands.Hands(
#     max_num_hands=2,
#     min_detection_confidence=0.5,
#     min_tracking_confidence=0.5
# )

# # **모델 훈련 시 사용한 액션 레이블 순서와 동일해야 함**
# actions = ['cross_finger', 'air_quotes', 'soso', 'good', 'point']
# seq_length = 30

# # CPU 집약적 작업을 위한 스레드 풀
# executor = ThreadPoolExecutor(max_workers=4)

# def extract_landmarks_and_angles(hand_landmarks):
#     joint = np.zeros((21, 4))
#     for j, lm in enumerate(hand_landmarks.landmark):
#         joint[j] = [lm.x, lm.y, lm.z, lm.visibility]

#     # 부모-자식 조인트 간 벡터 계산 및 정규화
#     v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], :3]
#     v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], :3]
#     v = v2 - v1
#     v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]
#     angle = np.arccos(np.einsum('nt,nt->n',
#         v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18], :],
#         v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19], :]))
#     angle = np.degrees(angle)

#     # 랜드마크와 각도 데이터를 결합
#     angle_label = np.array([angle], dtype=np.float32)
#     d = np.concatenate([joint.flatten(), angle_label.flatten()])
#     return d

# def preprocess_data(data, seq_length=30):
#     data = np.array(data)
#     if len(data) < seq_length:
#         return None
#     full_seq_data = []
#     for seq in range(len(data) - seq_length + 1):
#         full_seq_data.append(data[seq:seq + seq_length])
#     return np.array(full_seq_data)

# def process_video(video_path: str):
#     """
#     영상 파일을 처리하며, 각 슬라이딩 윈도우에 대해 예측을 수행.
#     """
#     cap = cv2.VideoCapture(video_path)
#     data = []
#     predictions = []  # 슬라이딩 윈도우마다의 예측 결과 저장
#     frames_count = 0

#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break
#         frames_count += 1
#         # BGR -> RGB 변환 후 MediaPipe 처리
#         img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         results = hands.process(img)
#         if results.multi_hand_landmarks:
#             for hand_landmarks in results.multi_hand_landmarks:
#                 d = extract_landmarks_and_angles(hand_landmarks)
#                 data.append(d)
#                 # 슬라이딩 윈도우가 충분히 쌓이면 예측 수행
#                 if len(data) >= seq_length:
#                     input_data = np.expand_dims(
#                         np.array(data[-seq_length:], dtype=np.float32), axis=0
#                     )
#                     prediction = model.predict(input_data)
#                     gesture_idx = int(np.argmax(prediction[0]))
#                     predictions.append(actions[gesture_idx])
#     cap.release()

#     # 예측 기록이 있으면 다수결로 최종 결과 결정
#     if predictions:
#         final_pred = Counter(predictions).most_common(1)[0][0]
#     else:
#         final_pred = None
#     return final_pred, frames_count, predictions

# @app.post("/predict")
# async def predict_gesture(file: UploadFile = File(...)):
#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_file:
#             tmp_file.write(contents)
#             video_path = tmp_file.name

#         loop = asyncio.get_running_loop()
#         final_pred, frames_count, predictions = await loop.run_in_executor(
#             executor, process_video, video_path
#         )

#         os.unlink(video_path)
#         if final_pred is None:
#             return {"error": "No hand detected", "frames_processed": frames_count}

#         # 마지막 몇 개 예측 결과도 함께 반환 (디버깅용)
#         return {
#             "gesture": final_pred,
#             "frames_processed": frames_count,
#             "prediction_history": predictions[-5:]
#         }
#     except Exception as e:
#         return {"error": str(e)}

import asyncio
import os
import tempfile
from concurrent.futures import ThreadPoolExecutor

import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse

app = FastAPI()

# 모델 및 MediaPipe 초기화 (글로벌 로드)
model = tf.keras.models.load_model('models/model.h5', compile=False)
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
mp_drawing = mp.solutions.drawing_utils

# 모델 훈련 시 사용한 액션 레이블 순서 (추론 시에도 동일하게 사용)
actions = ['cross_finger', 'air_quotes', 'soso', 'good', 'point']
seq_length = 30

# CPU 집약적 작업을 위한 스레드 풀
executor = ThreadPoolExecutor(max_workers=4)

def extract_landmarks_and_angles(hand_landmarks):
    """
    MediaPipe 손 랜드마크에서 x, y, z, visibility와 각도를 추출
    """
    joint = np.zeros((21, 4))
    for j, lm in enumerate(hand_landmarks.landmark):
        joint[j] = [lm.x, lm.y, lm.z, lm.visibility]

    # 부모-자식 조인트 간 벡터 계산 및 정규화
    v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], :3]
    v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], :3]
    v = v2 - v1
    v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]
    angle = np.arccos(np.einsum('nt,nt->n',
        v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18], :],
        v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19], :]))
    angle = np.degrees(angle)

    # 랜드마크와 각도 데이터를 결합
    angle_label = np.array([angle], dtype=np.float32)
    d = np.concatenate([joint.flatten(), angle_label.flatten()])
    return d

def preprocess_data(data, seq_length=30):
    """
    입력 데이터(프레임별 손 랜드마크)를 슬라이딩 윈도우(seq_length) 단위로 전처리
    """
    data = np.array(data)
    if len(data) < seq_length:
        return None
    full_seq_data = []
    for seq in range(len(data) - seq_length + 1):
        full_seq_data.append(data[seq:seq + seq_length])
    return np.array(full_seq_data)

def process_video_with_visualization(input_path: str, output_path: str):
    """
    입력 영상을 읽어 각 프레임에 손 랜드마크와 추론 결과를 오버레이하고,
    annotated 영상을 output_path에 저장합니다.
    """
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise ValueError("비디오 파일을 열 수 없습니다.")

    # 영상 속성 획득
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    data = []  # 각 프레임의 랜드마크 데이터 저장
    frame_idx = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1

        # 색상 변환 및 MediaPipe 처리
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)

        if results.multi_hand_landmarks:
            # 각 손에 대해 처리
            for hand_landmarks in results.multi_hand_landmarks:
                # 오버레이: 손 랜드마크 그리기
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                # 특징 추출
                d = extract_landmarks_and_angles(hand_landmarks)
                data.append(d)

                # 충분한 데이터가 쌓이면 추론 수행 (슬라이딩 윈도우)
                if len(data) >= seq_length:
                    input_data = np.expand_dims(
                        np.array(data[-seq_length:], dtype=np.float32), axis=0
                    )
                    prediction = model.predict(input_data)
                    gesture_idx = int(np.argmax(prediction[0]))
                    predicted_action = actions[gesture_idx]
                    # 프레임에 예측 결과 텍스트 오버레이
                    cv2.putText(frame, f'{predicted_action}', (10, 40),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        else:
            # 손이 인식되지 않으면 간단한 메시지 표시
            cv2.putText(frame, 'No hand detected', (10, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

        # annotated 프레임을 저장
        out.write(frame)

    cap.release()
    out.release()
    return frame_idx

@app.post("/visualize")
async def visualize_inference(file: UploadFile = File(...)):
    """
    업로드된 영상을 처리하여 annotated 영상(추론 과정 시각화)을 생성하고,
    최종 영상 파일을 클라이언트에 전송합니다.
    """
    try:
        contents = await file.read()
        # 입력 영상 임시 저장
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_in:
            tmp_in.write(contents)
            input_video_path = tmp_in.name

        # 출력 영상 임시 파일 경로
        output_video_path = input_video_path + "_annotated.mp4"

        loop = asyncio.get_running_loop()
        # 영상 처리 및 시각화: 별도 스레드에서 실행
        total_frames = await loop.run_in_executor(
            executor, process_video_with_visualization, input_video_path, output_video_path
        )

        # 입력 임시 파일 삭제
        os.unlink(input_video_path)
        
        # 최종 annotated 영상을 반환 (클라이언트에서 다운로드 또는 미리보기 가능)
        return FileResponse(
            output_video_path,
            media_type="video/mp4",
            filename="annotated_video.mp4"
        )
    except Exception as e:
        return {"error": str(e)}
