# import cv2
# import numpy as np
# import base64
# import tensorflow as tf
# import mediapipe as mp
# from fastapi import FastAPI, WebSocket

# app = FastAPI()

# # 학습된 모델 로드
# model = tf.keras.models.load_model('models/model.h5', compile=False)

# # 제스처 매핑
# actions = ['cross_finger', 'air_quotes', 'soso', 'good', 'point']
# seq_length = 30

# # MediaPipe 손 감지 설정
# mp_hands = mp.solutions.hands
# hands = mp_hands.Hands(
#     max_num_hands=2,
#     min_detection_confidence=0.5,
#     min_tracking_confidence=0.5
# )

# # 랜드마크와 각도 추출 함수
# def extract_landmarks_and_angles(res):
#     joint = np.zeros((21, 4))
#     for j, lm in enumerate(res.landmark):
#         joint[j] = [lm.x, lm.y, lm.z, lm.visibility]

#     # 부모-자식 관절 간 벡터 계산
#     v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], :3]
#     v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], :3]
#     v = v2 - v1
#     v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]

#     # 각도 계산
#     angle = np.arccos(np.einsum('nt,nt->n',
#         v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18], :],
#         v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19], :]))
#     angle = np.degrees(angle)

#     # 특징 벡터 구성
#     return np.concatenate([joint.flatten(), angle])

# @app.websocket("/ws/predict")
# async def websocket_predict(websocket: WebSocket):
#     await websocket.accept()
#     seq = []
#     action_seq = []
#     final_action = None

#     try:
#         while True:
#             # 프레임 수신 (Base64 데이터)
#             data = await websocket.receive_text()
#             print("프레임 수신됨")

#             img_data = base64.b64decode(data.split(",")[1])  # "data:image/jpeg;base64," 제거
#             nparr = np.frombuffer(img_data, np.uint8)
#             frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#             # 프레임 처리
#             frame = cv2.flip(frame, 1)  # 좌우 반전
#             img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             result = hands.process(img_rgb)

#             if result.multi_hand_landmarks:
#                 print("손이 감지되었습니다.")
#                 for res in result.multi_hand_landmarks:
#                     d = extract_landmarks_and_angles(res)
#                     seq.append(d)
#                     print(f"시퀀스에 데이터 추가됨, 현재 길이: {len(seq)}")

#                     if len(seq) < seq_length:
#                         continue

#                     print("시퀀스 길이 충족, 예측 실행")
#                     # 입력 데이터 준비
#                     input_data = np.expand_dims(np.array(seq[-seq_length:], dtype=np.float32), axis=0)
#                     y_pred = model.predict(input_data).squeeze()
#                     i_pred = int(np.argmax(y_pred))
#                     conf = y_pred[i_pred]
#                     print(f"예측 제스처: {actions[i_pred]}, 신뢰도: {conf}")

#                     if conf < 0.9:
#                         continue

#                     action = actions[i_pred]
#                     action_seq.append(action)
#                     print(f"액션 시퀀스에 추가: {action}, 현재 시퀀스: {action_seq}")

#                     if len(action_seq) >= 3 and action_seq[-1] == action_seq[-2] == action_seq[-3]:
#                         final_action = action
#                         print(f"연속 3회 동일 제스처 감지: {final_action}")
#                         await websocket.send_text(final_action)
#                         seq = []  # 시퀀스 초기화
#                         action_seq = []  # 액션 시퀀스 초기화
#             else:
#                 print("손이 감지되지 않았습니다.")

#             # 추론 결과가 없으면 "No gesture" 전송
#             if final_action is None:
#                 await websocket.send_text("No gesture")
#             # else:
#             #     final_action = None  # 다음 예측을 위해 초기화

#     except Exception as e:
#         print(f"WebSocket error: {e}")
#         await websocket.send_text(f"Error: {str(e)}")
#     finally:
#         await websocket.close()

# import json
# import numpy as np
# import tensorflow as tf
# from fastapi import FastAPI, WebSocket

# app = FastAPI()

# # 학습된 모델 로드 (미리 학습된 모델 파일이 필요함)
# model = tf.keras.models.load_model('models/model.h5', compile=False)

# # 제스처 매핑 (사용자의 모델에 맞게 수정 필요)
# actions = ['cross_finger', 'air_quotes', 'soso', 'good', 'point']
# seq_length = 30  # 모델이 요구하는 시퀀스 길이

# # 랜드마크와 각도 추출 함수
# def extract_landmarks_and_angles(landmarks):
#     joint = np.array([[lm['x'], lm['y'], lm['z'], 1.0] for lm in landmarks])  # visibility는 1.0으로 가정

#     # 부모-자식 관절 간 벡터 계산
#     v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], :3]
#     v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], :3]
#     v = v2 - v1
#     v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]

#     # 각도 계산
#     angle = np.arccos(np.einsum('nt,nt->n',
#         v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18], :],
#         v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19], :]))
#     angle = np.degrees(angle)

#     # 특징 벡터 구성
#     return np.concatenate([joint.flatten(), angle])

# @app.websocket("/ws/predict")
# async def websocket_predict(websocket: WebSocket):
#     await websocket.accept()
#     seq = []
#     action_seq = []
#     final_action = None

#     try:
#         while True:
#             # 랜드마크 데이터 수신 (JSON)
#             data = await websocket.receive_text()
#             landmarks = json.loads(data)
#             d = extract_landmarks_and_angles(landmarks)
#             seq.append(d)

#             if len(seq) < seq_length:
#                 continue

#             # 입력 데이터 준비
#             input_data = np.expand_dims(np.array(seq[-seq_length:], dtype=np.float32), axis=0)
#             y_pred = model.predict(input_data).squeeze()
#             i_pred = int(np.argmax(y_pred))
#             conf = y_pred[i_pred]

#             if conf < 0.9:  # 신뢰도 임계값
#                 continue

#             action = actions[i_pred]
#             action_seq.append(action)

#             # 연속된 3번의 동일한 예측이 있을 경우 결과 확정
#             if len(action_seq) >= 3 and action_seq[-1] == action_seq[-2] == action_seq[-3]:
#                 final_action = action
#                 await websocket.send_text(final_action)
#                 seq = []  # 시퀀스 초기화
#                 action_seq = []  # 액션 시퀀스 초기화

#             # 추론 결과가 없으면 "No gesture" 전송
#             if final_action is None:
#                 await websocket.send_text("No gesture")
#             else:
#                 final_action = None  # 다음 예측을 위해 초기화

#     except Exception as e:
#         print(f"WebSocket error: {e}")
#         await websocket.send_text(f"Error: {str(e)}")
#     finally:
#         await websocket.close()


# 이건 그냥 3회연속 같은 값이면 추론결과 보내기
#--------------------------------------------------
# import json
# import numpy as np
# import tensorflow as tf
# from fastapi import FastAPI, WebSocket

# app = FastAPI()

# # 미리 학습된 모델 로드 (모델 파일 경로와 이름은 필요에 따라 수정)
# model = tf.keras.models.load_model('models/model.h5', compile=False)

# # 제스처 매핑 (모델에 맞게 수정)
# actions = ['cross_finger', 'air_quotes', 'soso', 'good', 'point']
# seq_length = 30  # 모델이 요구하는 시퀀스 길이

# def extract_landmarks_and_angles(landmarks):
#     """
#     landmarks: 각 랜드마크가 딕셔너리({ "x": float, "y": float, "z": float })
#     또는 리스트([x, y, z, ...]) 형식으로 담긴 리스트.
#     정상적인 경우 MediaPipe Hands는 21개의 랜드마크를 제공합니다.
#     visibility는 1.0으로 가정합니다.
#     """
#     if len(landmarks) != 21:
#         raise ValueError(f"Expected 21 landmarks, got {len(landmarks)}")

#     def get_xyz(lm):
#         # lm가 dict이면 키로, 리스트이면 인덱스로 값 취득
#         if isinstance(lm, dict):
#             return lm.get("x", 0), lm.get("y", 0), lm.get("z", 0)
#         elif isinstance(lm, list):
#             if len(lm) >= 3:
#                 return lm[0], lm[1], lm[2]
#             else:
#                 raise ValueError("랜드마크 리스트의 길이가 부족합니다.")
#         else:
#             raise ValueError("랜드마크 데이터 형식이 지원되지 않습니다.")

#     try:
#         joint = np.array([[*get_xyz(lm), 1.0] for lm in landmarks])
#     except Exception as e:
#         raise ValueError(f"랜드마크 데이터 형식 오류: {e}")

#     # 부모-자식 관절 간 벡터 계산 (인덱스는 필요에 따라 조정)
#     try:
#         v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], :3]
#         v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], :3]
#     except Exception as e:
#         raise ValueError(f"관절 인덱스 오류: {e}")

#     v = v2 - v1
#     v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]

#     # 각도 계산 (연속된 벡터 쌍의 내적을 이용)
#     angle = np.arccos(np.einsum('nt,nt->n',
#         v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18], :],
#         v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19], :]))
#     angle = np.degrees(angle)

#     # 특징 벡터 구성: 모든 관절 값을 평탄화한 뒤 각도를 이어 붙임
#     return np.concatenate([joint.flatten(), angle])

# @app.websocket("/ws/predict")
# async def websocket_predict(websocket: WebSocket):
#     await websocket.accept()
#     seq = []         # 최근 seq_length 프레임의 특징 벡터를 저장할 리스트
#     action_seq = []  # 연속된 예측 결과를 모아서 안정적인 최종 결과를 결정하기 위한 리스트
#     try:
#         while True:
#             data = await websocket.receive_text()
#             try:
#                 payload = json.loads(data)
#             except json.JSONDecodeError as e:
#                 await websocket.send_text(json.dumps({"gesture": f"Error: Invalid JSON - {str(e)}"}))
#                 continue

#             # 데이터 구조 확인: {"frames": [...]} 또는 단일 프레임 데이터
#             if "frames" in payload:
#                 frames = payload["frames"]
#                 if not isinstance(frames, list):
#                     continue
#                 for landmarks in frames:
#                     # 만약 landmarks가 리스트 안에 하나의 리스트(손 데이터)가 있다면 풀어줍니다.
#                     if isinstance(landmarks, list) and len(landmarks) == 1 and isinstance(landmarks[0], list):
#                         landmarks = landmarks[0]
#                     if not isinstance(landmarks, list):
#                         continue
#                     if len(landmarks) != 21:
#                         print(f"Skipping frame: Expected 21 landmarks, got {len(landmarks)}")
#                         continue
#                     try:
#                         d = extract_landmarks_and_angles(landmarks)
#                         seq.append(d)
#                     except Exception as e:
#                         print(f"랜드마크 처리 오류: {e}")
#                         continue
#             else:
#                 # 단일 프레임 데이터 처리
#                 if not isinstance(payload, list):
#                     continue
#                 # 만약 payload 자체가 리스트 안에 하나의 리스트라면 풀어줍니다.
#                 if len(payload) == 1 and isinstance(payload[0], list):
#                     payload = payload[0]
#                 if len(payload) != 21:
#                     print(f"Skipping frame: Expected 21 landmarks, got {len(payload)}")
#                     continue
#                 try:
#                     d = extract_landmarks_and_angles(payload)
#                     seq.append(d)
#                 except Exception as e:
#                     print(f"단일 프레임 처리 오류: {e}")
#                     continue

#             # 시퀀스 길이가 충분하지 않으면 넘어감
#             if len(seq) < seq_length:
#                 continue

#             # 최근 seq_length 프레임 데이터를 모델 입력 형식에 맞게 준비
#             input_data = np.expand_dims(np.array(seq[-seq_length:], dtype=np.float32), axis=0)
#             y_pred = model.predict(input_data).squeeze()
#             i_pred = int(np.argmax(y_pred))
#             conf = y_pred[i_pred]

#             if conf < 0.9:
#                 continue

#             action = actions[i_pred]
#             action_seq.append(action)

#             # 연속 3회 동일한 예측이 감지되면 결과 확정
#             if len(action_seq) >= 3 and action_seq[-1] == action_seq[-2] == action_seq[-3]:
#                 final_action = action
#                 print(f"최종 추론 결과: {final_action} (신뢰도: {conf})")
#                 await websocket.send_text(json.dumps({"gesture": final_action}))
#                 # 최종 결과 전송 후 2초간 유지 후 초기화
#                 import asyncio
#                 await asyncio.sleep(2)
#                 seq = []
#                 action_seq = []
#     except Exception as e:
#         print(f"WebSocket error: {e}")
#         await websocket.send_text(json.dumps({"gesture": f"Error: {str(e)}"}))
#     finally:
#         await websocket.close()
#----------------------------------------------------------------------

import json
import numpy as np
import tensorflow as tf
import asyncio
from fastapi import FastAPI, WebSocket

app = FastAPI()

model = tf.keras.models.load_model('models/model.h5', compile=False)
actions = ['cross_finger', 'air_quotes', 'soso', 'good', 'point']
seq_length = 30

def extract_landmarks_and_angles(landmarks):
    if len(landmarks) != 21:
        raise ValueError(f"Expected 21 landmarks, got {len(landmarks)}")
    def get_xyz(lm):
        if isinstance(lm, dict):
            return lm.get("x", 0), lm.get("y", 0), lm.get("z", 0)
        elif isinstance(lm, list):
            if len(lm) >= 3:
                return lm[0], lm[1], lm[2]
            else:
                raise ValueError("랜드마크 리스트의 길이가 부족합니다.")
        else:
            raise ValueError("랜드마크 데이터 형식이 지원되지 않습니다.")
    try:
        joint = np.array([[*get_xyz(lm), 1.0] for lm in landmarks])
    except Exception as e:
        raise ValueError(f"랜드마크 데이터 형식 오류: {e}")
    try:
        v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], :3]
        v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], :3]
    except Exception as e:
        raise ValueError(f"관절 인덱스 오류: {e}")
    v = v2 - v1
    v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]
    angle = np.arccos(np.einsum('nt,nt->n',
        v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18], :],
        v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19], :]))
    angle = np.degrees(angle)
    return np.concatenate([joint.flatten(), angle])

@app.websocket("/ws/predict")
async def websocket_predict(websocket: WebSocket):
    await websocket.accept()
    seq = []
    high_conf_threshold = 0.95
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
            except json.JSONDecodeError as e:
                await websocket.send_text(json.dumps({"gesture": f"Error: Invalid JSON - {str(e)}"}))
                continue
            if "frames" in payload:
                frames = payload["frames"]
                if not isinstance(frames, list):
                    continue
                for landmarks in frames:
                    if isinstance(landmarks, list) and len(landmarks) == 1 and isinstance(landmarks[0], list):
                        landmarks = landmarks[0]
                    if not isinstance(landmarks, list):
                        continue
                    if len(landmarks) != 21:
                        print(f"Skipping frame: Expected 21 landmarks, got {len(landmarks)}")
                        continue
                    try:
                        d = extract_landmarks_and_angles(landmarks)
                        seq.append(d)
                    except Exception as e:
                        print(f"랜드마크 처리 오류: {e}")
                        continue
            else:
                if not isinstance(payload, list):
                    continue
                if len(payload) == 1 and isinstance(payload[0], list):
                    payload = payload[0]
                if len(payload) != 21:
                    print(f"Skipping frame: Expected 21 landmarks, got {len(payload)}")
                    continue
                try:
                    d = extract_landmarks_and_angles(payload)
                    seq.append(d)
                except Exception as e:
                    print(f"단일 프레임 처리 오류: {e}")
                    continue

            if len(seq) < seq_length:
                continue

            input_data = np.expand_dims(np.array(seq[-seq_length:], dtype=np.float32), axis=0)
            y_pred = model.predict(input_data).squeeze()
            i_pred = int(np.argmax(y_pred))
            conf = y_pred[i_pred]
            if conf < 0.9:
                continue

            action = actions[i_pred]
            # 고신뢰도 예측이면 짧은 딜레이 후 바로 최종 결과로 채택
            if conf >= high_conf_threshold:
                await asyncio.sleep(0.5)  # 0.5초 딜레이
                final_action = actions[i_pred]
                print(f"최종 추론 결과 (즉시 고신뢰도): {final_action} (신뢰도: {conf})")
                await websocket.send_text(json.dumps({"gesture": final_action}))
                seq = []  # 시퀀스 초기화
            # 그렇지 않으면 기존 방식(연속 3회 연속 등)을 사용할 수도 있음.
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_text(json.dumps({"gesture": f"Error: {str(e)}"}))
    finally:
        await websocket.close()

