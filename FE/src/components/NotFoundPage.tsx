import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    window.history.back();
  };
  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center font-[NanumSquareRoundEB] bg-white px-4 dark:bg-gray-900 ">
      <p className="text-center text-[48px] sm:text-[64px] md:text-[80px] lg:text-[90px] leading-tight text-kr-500 dark:text-d-kr-500 font-bold mb-10">
        404
        <br />
        ERROR
      </p>
      <div className="text-center text-black dark:text-d-txt-50 text-[18px] sm-text-[24px] md:text-[28px] mb-12">
        <p>
          찾을 수 없는 페이지입니다.
          <br />
          요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨습니다.
        </p>
      </div>
      <div className="flex flex-row gap-8 sm:gap-10 lg:gap-14">
        <button
          className="bg-kr-600 hover:bg-kr-700 dark:bg-d-kr-600 dark:hover:bg-d-kr-700 text-white dark:text-d-txt-50 px-12 py-4 rounded-full text-base sm:text-xl lg:text-2xl cursor-pointer"
          onClick={handleHomeClick}
        >
          Home
        </button>
        <button
          className="bg-kr-600 hover:bg-kr-700 dark:bg-d-kr-600 dark:hover:bg-d-kr-700 text-white dark:text-d-txt-50 px-12 py-4 rounded-full text-base sm:text-xl lg:text-2xl cursor-pointer"
          onClick={handleBackClick}
        >
          BACK
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
