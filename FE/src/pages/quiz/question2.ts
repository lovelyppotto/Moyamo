export default [
  {
    status: 200,
    data: [
      {
        question_id: 1,
        question_text: '이 제스처의 의미는?',
        question_type: 'MEANING',
        options: [
          { option_id: 101, option_meaning: '승리' },
          { option_id: 102, option_meaning: '평화' },
          { option_id: 103, option_meaning: '모욕' },
          { option_id: 103, option_meaning: '인사' },
        ],
        answer: { answer_id: 1, correct_option_id: 101, correct_meaning: '승리' },
      }, 
      {
        question_id: 2,
        question_text: '이 상황에서 적절한 제스처는?',
        question_type: 'GESTURE',
        options: [
          { option_id: 199, gesture_id: 3, gesture_image: 'https://example.com/gesture5.png' },
          { option_id: 200, gesture_id: 4, gesture_image: 'https://example.com/gesture6.png' },
          { option_id: 201, gesture_id: 5, gesture_image: 'https://example.com/gesture5.png' },
          { option_id: 202, gesture_id: 6, gesture_image: 'https://example.com/gesture6.png' },
        ],
        answer: { answer_id: 2, correct_option_id: 201, correct_gesture_id: 5 },
      },
      {
        question_id: 3,
        question_text: '00나라에서 00의미로 사용되는 이 제스처를 맞추시오',
        question_type: 'CAMERA',
        options: [],
        answer: {
          answer_id: 3,
          correct_gesture_id: 7,
          correct_gesture_image: 'https://example.com/gesture7.png',
          correct_gesture_name: 'finger_heart',
        },
      },
      {
        question_id: 4,
        question_text: '이 상황에서 적절한 제스처는?',
        question_type: 'GESTURE',
        options: [
          { option_id: 199, gesture_id: 3, gesture_image: 'https://example.com/gesture5.png' },
          { option_id: 200, gesture_id: 4, gesture_image: 'https://example.com/gesture6.png' },
          { option_id: 201, gesture_id: 5, gesture_image: 'https://example.com/gesture5.png' },
          { option_id: 202, gesture_id: 6, gesture_image: 'https://example.com/gesture6.png' },
        ],
        answer: { answer_id: 2, correct_option_id: 201, correct_gesture_id: 5 },
      },
      {
        question_id: 5,
        question_text: '이 제스처의 의미는?',
        question_type: 'MEANING',
        options: [
          { option_id: 101, option_meaning: '승리' },
          { option_id: 102, option_meaning: '평화' },
          { option_id: 103, option_meaning: '모욕' },
          { option_id: 103, option_meaning: '인사' },
        ],
        answer: { answer_id: 1, correct_option_id: 101, correct_meaning: '승리' },
      },
    ],
  },
];
