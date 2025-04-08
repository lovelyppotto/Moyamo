//정답 여부에 따라서 애니메이션이 나오는 컴포넌트입니다.
interface AnimationProps {
  showWrongImage: boolean;
  showCorrectImage: boolean;
}

function Animation({ showWrongImage, showCorrectImage }: AnimationProps): JSX.Element {
  return (
    <>
      {showCorrectImage && (
        <img
          src="/images/correct.png"
          alt="correct_img"
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100 w-[80vh] h-[80vh]"
        />
      )}
      {showWrongImage && (
        <img
          src="/images/wrong.png"
          alt="wrong_img"
          className="z-100 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh]"
        />
      )}
    </>
  );
}

export default Animation;
