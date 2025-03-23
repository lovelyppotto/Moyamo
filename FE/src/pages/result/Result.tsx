import HeaderBar from "../home/HeaderBar";
import { useTheme } from '@/components/theme-provider';


function Result() {
  const { theme } = useTheme();
  
  return (
    <div
      className="h-screen overflow-hidden w-full flex flex-col"
      style={{
        backgroundImage:
          theme === 'dark' ? 'url(/images/background-dark.webp)' : 'url(/images/background.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <HeaderBar />
    </div>
  )
}

export default Result;
