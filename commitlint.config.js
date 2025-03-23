export default {
    extends: ['@commitlint/config-conventional'],
    parserPreset: {
      parserOpts: {
        headerPattern: /^\[([^\]]+)\] (\w+)(?:\(([^)]+)\))?: (.+)/,
        headerCorrespondence: ['scope', 'type', 'module', 'subject'],
      },
    },
    rules: {
      'header-max-length': [2, 'always', 50], // 헤더 길이 50글자 제한
      'subject-case': [2, 'always', 'sentence-case'], // 첫 글자는 대문자 (sentence-case)
      'subject-full-stop': [2, 'never', '.'], // 마침표로 끝나지 않습니다
      'subject-exclamation-mark': [2, 'never'], // 느낌표로 끝나지 않습니다
      'subject-empty': [2, 'never'], // 제목은 비울 수 없습니다
  
      'body-max-line-length': [2, 'always', 72], // 본문 줄 길이 제한
      'footer-max-line-length': [2, 'always', 100],
      'body-leading-blank': [2, 'always'], // 본문 작성 전 개행
      'footer-leading-blank': [2, 'always'], // 푸터 작성 전 개행
      'scope-enum': [0],
      'scope-case': [0],
      'type-enum': [
        2,
        'always',
        [
          'feat',
          'fix',
          'docs',
          'style',
          'refactor',
          'test',
          'chore',
          'perf',
          'ci',
          'build',
          'revert',
        ],
      ],
      'scope-empty': [0, 'never'],
      'references-empty': [0, 'never'], // 레퍼런스 필드 검사 비활성화
    },
  };
  