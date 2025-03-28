import numpy as np
import mediapipe as mp

def extract_landmarks_and_angles(hand_landmarks):
    """
    MediaPipe 손 랜드마크에서 x, y, z, visibility와 각도를 추출 (create_dataset.py 기반)
    """
    joint = np.zeros((21, 4))
    for j, lm in enumerate(hand_landmarks.landmark):
        joint[j] = [lm.x, lm.y, lm.z, lm.visibility]

    # 각도 계산 (create_dataset.py와 동일)
    v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], :3]  # 부모 조인트
    v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], :3]  # 자식 조인트
    v = v2 - v1
    v = v / np.linalg.norm(v, axis=1)[:, np.newaxis]
    angle = np.arccos(np.einsum('nt,nt->n',
        v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18], :],
        v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19], :]))
    angle = np.degrees(angle)

    # 데이터 결합
    angle_label = np.array([angle], dtype=np.float32)
    d = np.concatenate([joint.flatten(), angle_label.flatten()])
    return d

def preprocess_data(data, seq_length=30):
    """
    데이터를 시퀀스 형태로 전처리 (train.ipynb와 호환)
    """
    data = np.array(data)
    if len(data) < seq_length:
        return None
    full_seq_data = []
    for seq in range(len(data) - seq_length + 1):
        full_seq_data.append(data[seq:seq + seq_length])
    return np.array(full_seq_data)