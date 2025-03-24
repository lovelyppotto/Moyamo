// import { useEffect, useRef } from 'react';
// import lottie from 'lottie-web';

// const AiQuiz = () => {
// const animationRef = useRef(null);

//   useEffect(() => {
//     if (animationRef.current) {
//       const anim = lottie.loadAnimation({
//         container: animationRef.current,
//         renderer: 'svg',
//         loop: true,
//         autoplay: true,
//         path: '/assets/lottie/quizCount.json' // 파일 경로 직접 지정
//         // 또는 animationData: yourImportedJsonData // JSON을 직접 import한 경우
//       });

//       return () => anim.destroy();
//     }
//   }, []);

//   return (
//     <div className='bg-black/50 h-screen w-full overflow-hidden'>
//         <div ref={animationRef} className="w-64 h-64 " />
//     </div>
//   );
// };

// export default AiQuiz;
