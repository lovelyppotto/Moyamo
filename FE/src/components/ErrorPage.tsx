import { useNavigate } from 'react-router-dom';

function ErrorPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    window.history.back();
  };
  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center font-[NanumSquareRoundEB] bg-white px-4">
      <p className="text-center text-[48px] sm:text-[64px] md:text-[80px] lg:text-[90px] leading-tight text-[#5E7CFF] font-bold mb-10">
        404
        <br />
        ERROR
      </p>
      <div className="text-center text-black text-[18px] sm-text-[24px] md:text-[28px] mb-12">
        <p>
          찾을 수 없는 페이지입니다.
          <br />
          요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다.
        </p>
      </div>
      <div className="flex flex-row gap-8 sm:gap-10 lg:gap-14">
        <button
          className="bg-[#5E7CFF] text-white px-8 py-3 rounded-xl text-base sm:text-xl lg:text-2xl"
          onClick={handleBackClick}
        >
          BACK
        </button>
        <button
          className="bg-[#5E7CFF] text-white px-8 py-3 rounded-xl text-base sm:text-xl lg:text-2xl"
          onClick={handleHomeClick}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
