import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CountryDropdownProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  countries: string[];
}

function CountryDropdown({ selectedCountry, setSelectedCountry, countries }: CountryDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="flex items-center justify-between
                    min-w-[90px] md:min-w-[110px] lg:min-w-[130px] 
                    w-auto whitespace-nowrap
                    bg-kr-300 dark:bg-blue-900 rounded-md p-1 px-2
                    cursor-pointer relative"
        >
          <ChevronDown size={18} className="flex-shrink-0 ml-1 md:ml-2" />
          <div className="flex-1 flex items-center justify-center">
            <span
              className="text-xs md:text-sm lg:text-base
                        font-[NanumSquareRound] font-extrabold"
            >
              {selectedCountry}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="block text-center
          mt-1 p-0
          min-w-[90px] md:min-w-[110px] lg:min-w-[130px]
          bg-white border-none drop-shadow-basic"
      >
        {countries.map((c) => (
          <DropdownMenuItem
            key={c}
            className="rounded-none 
              justify-center text-center  
              font-[NanumSquareRound] text-md cursor-pointer
              hover:bg-kr-100"
            onClick={() => setSelectedCountry(c)}
          >
            {c}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CountryDropdown;
