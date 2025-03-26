import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 얻기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 경로 설정
const inputDir = path.join(__dirname, '../public/images/attractions');
const outputDir = path.join(__dirname, '../public/images/attraction');

async function optimizeImages() {
  try {
    // 디렉토리가 없으면 생성
    await fs.mkdir(outputDir, { recursive: true }).catch(() => {});
    
    // 파일 목록 가져오기
    const files = await fs.readdir(inputDir);
    
    for (const file of files) {
      if (!['.jpg', '.jpeg', '.png', '.webp'].some(ext => file.toLowerCase().endsWith(ext))) {
        continue; // 이미지 파일이 아니면 건너뛰기
      }
      
      const inputPath = path.join(inputDir, file);
      const fileName = path.basename(file, path.extname(file));
      const outputPath = path.join(outputDir, `${fileName}.webp`);
      
      // 이미지 크기 조정 및 WebP로 변환
      await sharp(inputPath)
        .resize(150) // 최대 너비 130px로 제한 (필요에 따라 조정)
        .webp({ quality: 90 }) // WebP 형식으로 변환, 품질 90%
        .toFile(outputPath);
    }
    
    console.log('모든 이미지 최적화가 완료되었습니다!');
  } catch (error) {
    console.error('이미지 최적화 중 오류 발생:', error);
  }
}

optimizeImages();